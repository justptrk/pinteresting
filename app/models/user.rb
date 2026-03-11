class User < ActiveRecord::Base
  has_secure_password

  has_many :managed_clients, class_name: 'Client', foreign_key: 'account_manager_id'
  has_many :assigned_tasks, class_name: 'Task', foreign_key: 'assigned_to_id'
  has_many :created_tasks, class_name: 'Task', foreign_key: 'created_by_id'
  has_many :assigned_leads, class_name: 'Lead', foreign_key: 'assigned_to_id'
  has_many :assigned_content, class_name: 'ContentItem', foreign_key: 'assigned_to_id'
  has_many :created_campaigns, class_name: 'Campaign', foreign_key: 'created_by_id'
  has_many :generated_reports, class_name: 'Report', foreign_key: 'generated_by_id'
  has_many :activities

  ROLES = %w[admin manager team_member].freeze

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i }
  validates :first_name, :last_name, presence: true
  validates :role, inclusion: { in: ROLES }

  before_save { self.email = email.downcase }
  before_create :generate_remember_token

  def full_name
    "#{first_name} #{last_name}"
  end

  def admin?
    role == 'admin'
  end

  def manager?
    role == 'manager'
  end

  def initials
    "#{first_name[0]}#{last_name[0]}".upcase
  end

  def self.generate_token
    SecureRandom.urlsafe_base64
  end

  private

  def generate_remember_token
    self.remember_token = User.generate_token
  end
end
