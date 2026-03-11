class Activity < ActiveRecord::Base
  belongs_to :user
  belongs_to :trackable, polymorphic: true

  scope :recent, -> { order(created_at: :desc).limit(20) }

  def description
    "#{user.full_name} #{action} #{trackable_type.underscore.humanize.downcase}"
  end
end
