class Campaign < ActiveRecord::Base
  belongs_to :client
  belongs_to :created_by, optional: true, class_name: 'User'
  has_many :content_items, dependent: :destroy
  has_many :leads, dependent: :nullify
  has_many :tasks, dependent: :destroy

  STATUSES = %w[draft active paused completed cancelled].freeze
  CHANNELS = %w[seo ppc social email content display affiliate].freeze

  validates :name, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :channel, inclusion: { in: CHANNELS }, allow_blank: true

  scope :active, -> { where(status: 'active') }
  scope :by_channel, ->(channel) { where(channel: channel) }

  def budget_remaining
    (budget || 0) - (spent || 0)
  end

  def budget_utilization
    return 0 unless budget && budget > 0
    ((spent || 0) / budget * 100).round(1)
  end

  def conversion_rate
    return 0 unless clicks && clicks > 0
    ((conversions || 0).to_f / clicks * 100).round(2)
  end

  def cost_per_conversion
    return 0 unless conversions && conversions > 0
    ((spent || 0) / conversions).round(2)
  end

  def roi
    return 0 unless spent && spent > 0
    (((revenue || 0) - spent) / spent * 100).round(1)
  end

  def status_color
    case status
    when 'active' then 'success'
    when 'draft' then 'default'
    when 'paused' then 'warning'
    when 'completed' then 'info'
    when 'cancelled' then 'danger'
    end
  end

  def channel_icon
    case channel
    when 'seo' then 'search'
    when 'ppc' then 'usd'
    when 'social' then 'share-alt'
    when 'email' then 'envelope'
    when 'content' then 'pencil'
    when 'display' then 'desktop'
    when 'affiliate' then 'link'
    else 'bullhorn'
    end
  end
end
