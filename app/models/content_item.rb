class ContentItem < ActiveRecord::Base
  belongs_to :client
  belongs_to :campaign, optional: true
  belongs_to :assigned_to, class_name: 'User', optional: true

  CONTENT_TYPES = %w[blog_post social_post email landing_page video infographic whitepaper ad_copy].freeze
  PLATFORMS = %w[facebook instagram twitter linkedin google youtube tiktok website email].freeze
  STATUSES = %w[idea draft review approved scheduled published archived].freeze

  validates :title, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :content_type, inclusion: { in: CONTENT_TYPES }, allow_blank: true
  validates :platform, inclusion: { in: PLATFORMS }, allow_blank: true

  scope :scheduled, -> { where(status: 'scheduled').order(:scheduled_at) }
  scope :published, -> { where(status: 'published') }
  scope :upcoming, -> { where('scheduled_at >= ?', Time.current).order(:scheduled_at) }
  scope :for_date, ->(date) { where(scheduled_at: date.beginning_of_day..date.end_of_day) }

  def overdue?
    scheduled_at && scheduled_at < Time.current && status != 'published'
  end

  def status_color
    case status
    when 'published' then 'success'
    when 'approved', 'scheduled' then 'info'
    when 'review' then 'warning'
    when 'draft' then 'default'
    when 'idea' then 'primary'
    when 'archived' then 'danger'
    end
  end

  def content_type_label
    content_type.to_s.titleize
  end

  def platform_icon
    case platform
    when 'facebook' then 'facebook'
    when 'instagram' then 'instagram'
    when 'twitter' then 'twitter'
    when 'linkedin' then 'linkedin'
    when 'google' then 'google'
    when 'youtube' then 'youtube-play'
    when 'tiktok' then 'music'
    when 'website' then 'globe'
    when 'email' then 'envelope'
    else 'file-text'
    end
  end
end
