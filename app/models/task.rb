class Task < ActiveRecord::Base
  belongs_to :client, optional: true
  belongs_to :campaign, optional: true
  belongs_to :assigned_to, class_name: 'User', optional: true
  belongs_to :created_by, class_name: 'User', optional: true

  STATUSES = %w[pending in_progress review completed cancelled].freeze
  PRIORITIES = %w[low medium high urgent].freeze
  CATEGORIES = %w[design development copywriting seo analytics social ads strategy].freeze

  validates :title, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :priority, inclusion: { in: PRIORITIES }
  validates :category, inclusion: { in: CATEGORIES }, allow_blank: true

  scope :pending, -> { where(status: 'pending') }
  scope :in_progress, -> { where(status: 'in_progress') }
  scope :completed, -> { where(status: 'completed') }
  scope :overdue, -> { where('due_date < ? AND status NOT IN (?)', Date.current, ['completed', 'cancelled']) }
  scope :due_today, -> { where(due_date: Date.current) }
  scope :by_priority, -> { order(Arel.sql("CASE priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END")) }

  def overdue?
    due_date && due_date < Date.current && !%w[completed cancelled].include?(status)
  end

  def priority_color
    case priority
    when 'urgent' then 'danger'
    when 'high' then 'warning'
    when 'medium' then 'info'
    when 'low' then 'default'
    end
  end

  def status_color
    case status
    when 'completed' then 'success'
    when 'in_progress' then 'info'
    when 'review' then 'warning'
    when 'pending' then 'default'
    when 'cancelled' then 'danger'
    end
  end
end
