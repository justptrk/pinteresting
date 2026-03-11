class CampaignsController < ApplicationController
  before_action :require_login
  before_action :set_campaign, only: [:show, :edit, :update, :destroy]

  def index
    @campaigns = Campaign.all.includes(:client).order(created_at: :desc)
    @campaigns = @campaigns.where(status: params[:status]) if params[:status].present?
    @campaigns = @campaigns.where(channel: params[:channel]) if params[:channel].present?
    @total_budget = Campaign.sum(:budget)
    @total_spent = Campaign.sum(:spent)
    @total_revenue = Campaign.sum(:revenue)
  end

  def show
    @content_items = @campaign.content_items.order(created_at: :desc)
    @leads = @campaign.leads.order(created_at: :desc)
    @tasks = @campaign.tasks.order(created_at: :desc)
  end

  def new
    @campaign = Campaign.new
    @campaign.client_id = params[:client_id] if params[:client_id]
  end

  def create
    @campaign = Campaign.new(campaign_params)
    @campaign.created_by = current_user
    if @campaign.save
      track_activity('created', @campaign)
      flash[:success] = "Campaign '#{@campaign.name}' has been created."
      redirect_to @campaign
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @campaign.update(campaign_params)
      track_activity('updated', @campaign)
      flash[:success] = "Campaign updated successfully."
      redirect_to @campaign
    else
      render :edit
    end
  end

  def destroy
    @campaign.destroy
    flash[:info] = "Campaign has been removed."
    redirect_to campaigns_path
  end

  private

  def set_campaign
    @campaign = Campaign.find(params[:id])
  end

  def campaign_params
    params.require(:campaign).permit(:name, :client_id, :channel, :status, :budget, :spent,
                                      :start_date, :end_date, :objective, :description,
                                      :impressions, :clicks, :conversions, :revenue, :cpc, :ctr, :roas)
  end
end
