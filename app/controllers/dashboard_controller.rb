class DashboardController < ApplicationController
  before_action :require_login

  def index
    @total_clients = Client.active.count
    @total_campaigns = Campaign.active.count
    @total_leads = Lead.active.count
    @total_revenue = Campaign.sum(:revenue)
    @total_spent = Campaign.sum(:spent)

    @overdue_tasks = Task.overdue.includes(:client, :assigned_to).limit(5)
    @upcoming_content = ContentItem.upcoming.includes(:client, :campaign).limit(5)
    @recent_leads = Lead.order(created_at: :desc).includes(:client, :campaign).limit(5)
    @recent_activities = Activity.recent.includes(:user, :trackable)

    @campaigns_by_channel = Campaign.active.group(:channel).count
    @leads_by_stage = Lead.active.group(:stage).count
    @leads_by_source = Lead.group(:source).count

    @top_campaigns = Campaign.active.order(revenue: :desc).includes(:client).limit(5)
    @tasks_due_today = Task.due_today.includes(:client, :assigned_to)
  end
end
