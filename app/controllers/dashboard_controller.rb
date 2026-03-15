class DashboardController < ApplicationController
  def index
  end

  def api_cloudtalk
    render json: cloudtalk_data
  end

  def api_manatal
    render json: manatal_data
  end

  def api_apollo
    render json: apollo_data
  end

  def api_pipeline
    render json: pipeline_data
  end

  def api_gmail
    render json: gmail_data
  end

  def api_overview
    render json: overview_data
  end

  private

  def cloudtalk_data
    {
      status: "CONNECTED",
      total_calls_today: 147,
      avg_call_duration: "4:32",
      calls_in_queue: 3,
      active_agents: 8,
      missed_calls: 12,
      answer_rate: 91.8,
      recent_calls: [
        { agent: "Sarah Chen", candidate: "Marcus Webb", duration: "6:14", status: "completed", time: "2 min ago" },
        { agent: "James Rodriguez", candidate: "Tina Patel", duration: "3:45", status: "completed", time: "8 min ago" },
        { agent: "Emily Foster", candidate: "David Kim", duration: "0:00", status: "missed", time: "12 min ago" },
        { agent: "Sarah Chen", candidate: "Lisa Chang", duration: "8:22", status: "completed", time: "15 min ago" },
        { agent: "Mike Torres", candidate: "Ryan O'Brien", duration: "2:58", status: "completed", time: "22 min ago" }
      ],
      hourly_volume: [12, 18, 24, 31, 28, 22, 35, 42, 38, 29, 19, 14]
    }
  end

  def manatal_data
    {
      status: "CONNECTED",
      open_positions: 34,
      total_candidates: 1247,
      pipeline_stages: {
        sourced: 412,
        screening: 189,
        interview: 87,
        offer: 23,
        hired: 14
      },
      recent_candidates: [
        { name: "Alexandra Torres", position: "Sr. DevOps Engineer", stage: "Interview", score: 92, updated: "1h ago" },
        { name: "Brian Mitchell", position: "Data Analyst", stage: "Screening", score: 78, updated: "2h ago" },
        { name: "Carla Nguyen", position: "Product Manager", stage: "Offer", score: 95, updated: "3h ago" },
        { name: "Derek Washington", position: "Full Stack Dev", stage: "Sourced", score: 85, updated: "4h ago" },
        { name: "Elena Kowalski", position: "UX Designer", stage: "Interview", score: 88, updated: "5h ago" }
      ],
      weekly_hires: [2, 3, 1, 4, 2, 5, 3],
      time_to_fill_avg: 28
    }
  end

  def apollo_data
    {
      status: "CONNECTED",
      sequences_active: 12,
      contacts_reached: 3842,
      response_rate: 24.7,
      emails_sent_today: 234,
      meetings_booked: 18,
      top_sequences: [
        { name: "Senior Dev Outreach Q1", sent: 450, opened: 312, replied: 89, meetings: 12 },
        { name: "Data Science Talent", sent: 280, opened: 198, replied: 56, meetings: 8 },
        { name: "Executive Search", sent: 120, opened: 96, replied: 34, meetings: 6 },
        { name: "Engineering Passive", sent: 380, opened: 245, replied: 67, meetings: 9 }
      ],
      daily_outreach: [189, 234, 198, 267, 245, 212, 234]
    }
  end

  def pipeline_data
    {
      status: "CONNECTED",
      total_deals: 47,
      total_value: 2340000,
      weighted_value: 1456000,
      win_rate: 34.2,
      avg_deal_size: 49787,
      stages: [
        { name: "Prospect", count: 15, value: 680000 },
        { name: "Qualified", count: 12, value: 520000 },
        { name: "Proposal", count: 9, value: 480000 },
        { name: "Negotiation", count: 6, value: 380000 },
        { name: "Closed Won", count: 5, value: 280000 }
      ],
      recent_activity: [
        { deal: "TechCorp Staffing Contract", action: "Moved to Negotiation", value: 125000, time: "30 min ago" },
        { deal: "DataFlow Hiring Sprint", action: "New Proposal Sent", value: 89000, time: "1h ago" },
        { deal: "CloudFirst DevOps Team", action: "Meeting Scheduled", value: 156000, time: "2h ago" },
        { deal: "FinanceHub Analysts", action: "Qualified Lead", value: 67000, time: "3h ago" }
      ]
    }
  end

  def gmail_data
    {
      status: "CONNECTED",
      unread: 23,
      sent_today: 67,
      threads_active: 45,
      avg_response_time: "1h 12m",
      recent_emails: [
        { from: "Sarah Chen", subject: "RE: DevOps candidate follow-up", preview: "I spoke with Marcus and he's very interested in the role...", time: "5 min ago", unread: true },
        { from: "TechCorp HR", subject: "Contract Terms - Staffing Agreement", preview: "Please find attached the revised terms for our staffing...", time: "18 min ago", unread: true },
        { from: "James Rodriguez", subject: "Weekly Pipeline Report", preview: "Here's the summary of this week's recruiting pipeline...", time: "45 min ago", unread: false },
        { from: "LinkedIn Recruiter", subject: "5 new candidate matches", preview: "Based on your saved searches, we found 5 new profiles...", time: "1h ago", unread: true },
        { from: "Carla Nguyen", subject: "Offer Letter - Product Manager", preview: "I've reviewed the offer details and would like to discuss...", time: "2h ago", unread: false }
      ],
      volume_by_hour: [5, 3, 8, 12, 18, 22, 15, 9, 11, 14, 8, 6]
    }
  end

  def overview_data
    {
      revenue_mtd: 487000,
      revenue_target: 650000,
      placements_mtd: 14,
      placements_target: 22,
      active_clients: 28,
      active_candidates: 342,
      interviews_scheduled: 19,
      offers_pending: 7,
      team_utilization: 78.4,
      nps_score: 72,
      alerts: [
        { level: "critical", message: "3 offer deadlines expiring within 24h", time: "now" },
        { level: "warning", message: "Cloudtalk queue exceeding 5 min wait time", time: "10 min ago" },
        { level: "info", message: "Weekly team sync in 2 hours", time: "30 min ago" },
        { level: "warning", message: "Apollo.io daily send limit at 89%", time: "1h ago" }
      ]
    }
  end
end
