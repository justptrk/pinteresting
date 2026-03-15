// ============================================
// TRIANGLE WORKFORCE - COMMAND CENTER
// Dashboard JavaScript Controller
// ============================================

(function() {
  'use strict';

  var TWDashboard = {
    syncInterval: 30,
    syncCountdown: 30,
    countdownTimer: null,

    init: function() {
      this.updateClock();
      setInterval(this.updateClock.bind(this), 1000);
      this.startSyncCountdown();
      this.loadAllData();
    },

    // --- Clock ---
    updateClock: function() {
      var now = new Date();
      var dateEl = document.getElementById('current-date');
      var timeEl = document.getElementById('current-time');
      if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: '2-digit'
        }).toUpperCase();
      }
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-US', {
          hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
      }
    },

    // --- Sync Countdown ---
    startSyncCountdown: function() {
      var self = this;
      this.countdownTimer = setInterval(function() {
        self.syncCountdown--;
        var el = document.getElementById('sync-countdown');
        if (el) el.textContent = self.syncCountdown;
        if (self.syncCountdown <= 0) {
          self.syncCountdown = self.syncInterval;
          self.loadAllData();
        }
      }, 1000);
    },

    // --- Load All Data ---
    loadAllData: function() {
      this.fetchData('/api/overview', this.renderOverview.bind(this));
      this.fetchData('/api/cloudtalk', this.renderCloudtalk.bind(this));
      this.fetchData('/api/manatal', this.renderManatal.bind(this));
      this.fetchData('/api/apollo', this.renderApollo.bind(this));
      this.fetchData('/api/pipeline', this.renderPipeline.bind(this));
      this.fetchData('/api/gmail', this.renderGmail.bind(this));
    },

    fetchData: function(url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText);
            callback(data);
          } catch(e) {
            console.error('Parse error for ' + url, e);
          }
        }
      };
      xhr.send();
    },

    // --- Render Overview KPIs ---
    renderOverview: function(data) {
      this.animateValue('kpi-revenue', '$' + this.formatNumber(data.revenue_mtd));
      this.setBar('kpi-revenue-bar', (data.revenue_mtd / data.revenue_target) * 100);

      this.animateValue('kpi-placements', data.placements_mtd);
      this.setBar('kpi-placements-bar', (data.placements_mtd / data.placements_target) * 100);

      this.animateValue('kpi-clients', data.active_clients);
      this.setText('kpi-interviews', data.interviews_scheduled);

      this.animateValue('kpi-utilization', data.team_utilization + '%');
      this.setBar('kpi-util-bar', data.team_utilization);
      this.setText('kpi-nps', data.nps_score);

      this.animateValue('kpi-offers', data.offers_pending);
      this.setText('kpi-candidates', data.active_candidates);

      // Render alerts ticker
      this.renderAlerts(data.alerts);
    },

    renderAlerts: function(alerts) {
      var ticker = document.getElementById('ticker-content');
      if (!ticker) return;
      var html = '';
      for (var i = 0; i < alerts.length; i++) {
        var a = alerts[i];
        html += '<span class="ticker-item">';
        html += '<span class="ticker-level ' + a.level + '">[' + a.level.toUpperCase() + ']</span>';
        html += a.message + ' — ' + a.time;
        html += '</span>';
      }
      // Duplicate for continuous scroll effect
      ticker.innerHTML = html + html;
    },

    // --- Render Cloudtalk ---
    renderCloudtalk: function(data) {
      this.setText('ct-calls', data.total_calls_today);
      this.setText('ct-avg', data.avg_call_duration);
      this.setText('ct-queue', data.calls_in_queue);

      // Bar chart
      var chart = document.getElementById('ct-chart');
      if (chart) {
        var max = Math.max.apply(null, data.hourly_volume);
        var hours = ['6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p'];
        var html = '';
        for (var i = 0; i < data.hourly_volume.length; i++) {
          var pct = (data.hourly_volume[i] / max) * 100;
          html += '<div class="bar-col">';
          html += '<div class="bar cyan" style="height:' + pct + '%"></div>';
          html += '<span class="bar-label">' + hours[i] + '</span>';
          html += '</div>';
        }
        chart.innerHTML = html;
      }

      // Recent calls
      var list = document.getElementById('ct-activity');
      if (list) {
        var html = '';
        for (var i = 0; i < data.recent_calls.length; i++) {
          var c = data.recent_calls[i];
          var dotClass = c.status === 'completed' ? 'green' : 'red';
          var badgeClass = c.status === 'completed' ? 'completed' : 'missed';
          html += '<li class="activity-item">';
          html += '<div class="activity-dot ' + dotClass + '"></div>';
          html += '<div class="activity-info">';
          html += '<div class="activity-primary">' + c.agent + ' → ' + c.candidate + '</div>';
          html += '<div class="activity-secondary">' + c.duration + '</div>';
          html += '</div>';
          html += '<span class="activity-badge ' + badgeClass + '">' + c.status.toUpperCase() + '</span>';
          html += '<span class="activity-meta">' + c.time + '</span>';
          html += '</li>';
        }
        list.innerHTML = html;
      }
    },

    // --- Render Manatal ---
    renderManatal: function(data) {
      this.setText('mn-positions', data.open_positions);
      this.setText('mn-candidates', this.formatNumber(data.total_candidates));
      this.setText('mn-ttf', data.time_to_fill_avg);

      // Pipeline funnel
      var funnel = document.getElementById('mn-funnel');
      if (funnel) {
        var stages = data.pipeline_stages;
        var keys = ['sourced', 'screening', 'interview', 'offer', 'hired'];
        var labels = ['SOURCED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED'];
        var maxVal = stages.sourced;
        var html = '';
        for (var i = 0; i < keys.length; i++) {
          var val = stages[keys[i]];
          var pct = (val / maxVal) * 100;
          html += '<div class="funnel-stage">';
          html += '<span class="funnel-label">' + labels[i] + '</span>';
          html += '<div class="funnel-bar-track">';
          html += '<div class="funnel-bar-fill stage-' + (i+1) + '" style="width:' + pct + '%">' + val + '</div>';
          html += '</div>';
          html += '<span class="funnel-count">' + val + '</span>';
          html += '</div>';
        }
        funnel.innerHTML = html;
      }

      // Candidates list
      var cList = document.getElementById('mn-candidates-list');
      if (cList) {
        var html = '';
        for (var i = 0; i < data.recent_candidates.length; i++) {
          var c = data.recent_candidates[i];
          var stageClass = c.stage.toLowerCase();
          var scoreClass = c.score >= 90 ? 'high' : (c.score >= 80 ? 'mid' : 'low');
          html += '<li class="activity-item">';
          html += '<div class="activity-dot cyan"></div>';
          html += '<div class="activity-info">';
          html += '<div class="activity-primary">' + c.name + '</div>';
          html += '<div class="activity-secondary">' + c.position + ' <span class="stage-badge ' + stageClass + '">' + c.stage.toUpperCase() + '</span></div>';
          html += '</div>';
          html += '<div class="candidate-score ' + scoreClass + '">' + c.score + '</div>';
          html += '</li>';
        }
        cList.innerHTML = html;
      }
    },

    // --- Render Apollo ---
    renderApollo: function(data) {
      this.setText('ap-sequences', data.sequences_active);
      this.setText('ap-sent', data.emails_sent_today);
      this.setText('ap-response', data.response_rate + '%');

      // Outreach chart
      var chart = document.getElementById('ap-chart');
      if (chart) {
        var max = Math.max.apply(null, data.daily_outreach);
        var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        var html = '';
        for (var i = 0; i < data.daily_outreach.length; i++) {
          var pct = (data.daily_outreach[i] / max) * 100;
          html += '<div class="bar-col">';
          html += '<div class="bar blue" style="height:' + pct + '%"></div>';
          html += '<span class="bar-label">' + days[i] + '</span>';
          html += '</div>';
        }
        chart.innerHTML = html;
      }

      // Sequences table
      var tbody = document.getElementById('ap-seq-body');
      if (tbody) {
        var html = '';
        for (var i = 0; i < data.top_sequences.length; i++) {
          var s = data.top_sequences[i];
          html += '<tr>';
          html += '<td class="seq-name">' + s.name + '</td>';
          html += '<td>' + s.sent + '</td>';
          html += '<td>' + s.opened + '</td>';
          html += '<td>' + s.replied + '</td>';
          html += '<td class="highlight" style="color:#10b981">' + s.meetings + '</td>';
          html += '</tr>';
        }
        tbody.innerHTML = html;
      }
    },

    // --- Render Pipeline ---
    renderPipeline: function(data) {
      this.setText('pl-deals', data.total_deals);
      this.setText('pl-value', '$' + this.formatCompact(data.total_value));
      this.setText('pl-winrate', data.win_rate + '%');

      // Deal funnel
      var funnel = document.getElementById('pl-funnel');
      if (funnel) {
        var maxVal = data.stages[0].value;
        var html = '';
        for (var i = 0; i < data.stages.length; i++) {
          var s = data.stages[i];
          var pct = (s.value / maxVal) * 100;
          html += '<div class="funnel-stage">';
          html += '<span class="funnel-label">' + s.name.toUpperCase() + '</span>';
          html += '<div class="funnel-bar-track">';
          html += '<div class="funnel-bar-fill stage-' + (i+1) + '" style="width:' + pct + '%">$' + this.formatCompact(s.value) + '</div>';
          html += '</div>';
          html += '<span class="funnel-count">' + s.count + '</span>';
          html += '</div>';
        }
        funnel.innerHTML = html;
      }

      // Deals list
      var dealsList = document.getElementById('pl-deals-list');
      if (dealsList) {
        var html = '';
        for (var i = 0; i < data.recent_activity.length; i++) {
          var d = data.recent_activity[i];
          html += '<div class="deal-item">';
          html += '<div class="deal-header">';
          html += '<span class="deal-name">' + d.deal + '</span>';
          html += '<span class="deal-value">$' + this.formatNumber(d.value) + '</span>';
          html += '</div>';
          html += '<div class="deal-action">' + d.action + '</div>';
          html += '<div class="deal-time">' + d.time + '</div>';
          html += '</div>';
        }
        dealsList.innerHTML = html;
      }
    },

    // --- Render Gmail ---
    renderGmail: function(data) {
      this.setText('gm-unread', data.unread);
      this.setText('gm-sent', data.sent_today);
      this.setText('gm-response', data.avg_response_time);

      // Email volume chart
      var chart = document.getElementById('gm-chart');
      if (chart) {
        var max = Math.max.apply(null, data.volume_by_hour);
        var hours = ['6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p'];
        var html = '';
        for (var i = 0; i < data.volume_by_hour.length; i++) {
          var pct = (data.volume_by_hour[i] / max) * 100;
          html += '<div class="bar-col">';
          html += '<div class="bar green" style="height:' + pct + '%"></div>';
          html += '<span class="bar-label">' + hours[i] + '</span>';
          html += '</div>';
        }
        chart.innerHTML = html;
      }

      // Inbox
      var inbox = document.getElementById('gm-inbox');
      if (inbox) {
        var html = '';
        for (var i = 0; i < data.recent_emails.length; i++) {
          var e = data.recent_emails[i];
          var unreadClass = e.unread ? 'unread' : '';
          html += '<div class="email-item ' + unreadClass + '">';
          html += '<div class="email-header">';
          html += '<span class="email-from">' + e.from + '</span>';
          html += '<span class="email-time">' + e.time + '</span>';
          html += '</div>';
          html += '<div class="email-subject">' + e.subject + '</div>';
          html += '<div class="email-preview">' + e.preview + '</div>';
          html += '</div>';
        }
        inbox.innerHTML = html;
      }
    },

    // --- Helpers ---
    setText: function(id, value) {
      var el = document.getElementById(id);
      if (el) el.textContent = value;
    },

    animateValue: function(id, value) {
      var el = document.getElementById(id);
      if (el) {
        el.style.opacity = '0.5';
        el.textContent = value;
        setTimeout(function() { el.style.opacity = '1'; }, 100);
      }
    },

    setBar: function(id, pct) {
      var el = document.getElementById(id);
      if (el) el.style.width = Math.min(pct, 100) + '%';
    },

    formatNumber: function(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    formatCompact: function(num) {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
      return num.toString();
    }
  };

  // Initialize on page load (compatible with Turbolinks)
  var ready = function() {
    if (document.getElementById('kpi-row')) {
      TWDashboard.init();
    }
  };

  document.addEventListener('DOMContentLoaded', ready);
  document.addEventListener('page:load', ready); // Turbolinks classic
})();
