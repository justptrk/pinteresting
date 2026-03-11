module ApplicationHelper
  def flash_class(level)
    case level.to_s
    when 'success' then 'alert-success'
    when 'danger' then 'alert-danger'
    when 'warning' then 'alert-warning'
    when 'info' then 'alert-info'
    else 'alert-info'
    end
  end

  def status_badge(status, color)
    content_tag(:span, status.to_s.titleize, class: "label label-#{color}")
  end

  def currency(amount)
    number_to_currency(amount || 0)
  end

  def short_number(num)
    return '0' unless num
    if num >= 1_000_000
      "#{(num / 1_000_000.0).round(1)}M"
    elsif num >= 1_000
      "#{(num / 1_000.0).round(1)}K"
    else
      num.to_s
    end
  end

  def percentage_bar(value, max = 100, color = 'info')
    pct = max > 0 ? (value.to_f / max * 100).round : 0
    pct = [pct, 100].min
    content_tag(:div, class: 'progress') do
      content_tag(:div, "#{pct}%",
        class: "progress-bar progress-bar-#{color}",
        role: 'progressbar',
        style: "width: #{pct}%;",
        'aria-valuenow' => pct,
        'aria-valuemin' => 0,
        'aria-valuemax' => 100)
    end
  end
end
