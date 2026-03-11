class Client < ActiveRecord::Base
  belongs_to :account_manager, optional: true, class_name: 'User'
  has_many :campaigns, dependent: :destroy
  has_many :content_items, dependent: :destroy
  has_many :leads, dependent: :destroy
  has_many :tasks, dependent: :destroy
  has_many :reports, dependent: :destroy

  STATUSES = %w[active inactive prospect churned].freeze

  validates :company_name, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :contact_email, format: { with: /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i }, allow_blank: true

  scope :active, -> { where(status: 'active') }
  scope :prospects, -> { where(status: 'prospect') }

  def total_campaign_budget
    campaigns.sum(:budget)
  end

  def total_campaign_spent
    campaigns.sum(:spent)
  end

  def active_campaigns_count
    campaigns.where(status: 'active').count
  end

  def total_leads
    leads.count
  end

  def won_leads
    leads.where(stage: 'won').count
  end

  def status_color
    case status
    when 'active' then 'success'
    when 'prospect' then 'info'
    when 'inactive' then 'warning'
    when 'churned' then 'danger'
    end
  end
end
