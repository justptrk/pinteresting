class Lead < ActiveRecord::Base
  belongs_to :client, optional: true
  belongs_to :campaign, optional: true
  belongs_to :assigned_to, class_name: 'User', optional: true

  STAGES = %w[new contacted qualified proposal negotiation won lost].freeze
  SOURCES = %w[organic paid referral social email direct event].freeze

  validates :name, presence: true
  validates :stage, inclusion: { in: STAGES }
  validates :source, inclusion: { in: SOURCES }, allow_blank: true

  scope :active, -> { where.not(stage: ['won', 'lost']) }
  scope :won, -> { where(stage: 'won') }
  scope :lost, -> { where(stage: 'lost') }
  scope :by_stage, ->(stage) { where(stage: stage) }

  def active?
    !%w[won lost].include?(stage)
  end

  def stage_color
    case stage
    when 'new' then 'info'
    when 'contacted' then 'primary'
    when 'qualified' then 'warning'
    when 'proposal' then 'default'
    when 'negotiation' then 'warning'
    when 'won' then 'success'
    when 'lost' then 'danger'
    end
  end

  def stage_percentage
    index = STAGES.index(stage) || 0
    ((index + 1).to_f / STAGES.length * 100).round
  end
end
