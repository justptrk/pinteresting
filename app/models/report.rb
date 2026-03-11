class Report < ActiveRecord::Base
  belongs_to :client
  belongs_to :generated_by, class_name: 'User', optional: true

  REPORT_TYPES = %w[monthly weekly campaign seo social ppc custom].freeze
  STATUSES = %w[draft final sent].freeze

  validates :title, presence: true
  validates :report_type, inclusion: { in: REPORT_TYPES }, allow_blank: true
  validates :status, inclusion: { in: STATUSES }

  scope :finals, -> { where(status: 'final') }
  scope :drafts, -> { where(status: 'draft') }

  def status_color
    case status
    when 'sent' then 'success'
    when 'final' then 'info'
    when 'draft' then 'default'
    end
  end
end
