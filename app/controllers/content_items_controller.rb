class ContentItemsController < ApplicationController
  before_action :require_login
  before_action :set_content_item, only: [:show, :edit, :update, :destroy]

  def index
    @content_items = ContentItem.all.includes(:client, :campaign, :assigned_to).order(created_at: :desc)
    @content_items = @content_items.where(status: params[:status]) if params[:status].present?
    @content_items = @content_items.where(platform: params[:platform]) if params[:platform].present?
  end

  def calendar
    @date = params[:date] ? Date.parse(params[:date]) : Date.current
    @start_date = @date.beginning_of_month.beginning_of_week
    @end_date = @date.end_of_month.end_of_week
    @content_items = ContentItem.where(scheduled_at: @start_date..@end_date)
                                .includes(:client, :campaign)
                                .order(:scheduled_at)
    @grouped_content = @content_items.group_by { |ci| ci.scheduled_at.to_date }
  end

  def show
  end

  def new
    @content_item = ContentItem.new
    @content_item.client_id = params[:client_id] if params[:client_id]
    @content_item.campaign_id = params[:campaign_id] if params[:campaign_id]
  end

  def create
    @content_item = ContentItem.new(content_item_params)
    if @content_item.save
      track_activity('created', @content_item)
      flash[:success] = "Content '#{@content_item.title}' has been created."
      redirect_to @content_item
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @content_item.update(content_item_params)
      track_activity('updated', @content_item)
      flash[:success] = "Content updated successfully."
      redirect_to @content_item
    else
      render :edit
    end
  end

  def destroy
    @content_item.destroy
    flash[:info] = "Content item has been removed."
    redirect_to content_items_path
  end

  private

  def set_content_item
    @content_item = ContentItem.find(params[:id])
  end

  def content_item_params
    params.require(:content_item).permit(:title, :body, :content_type, :platform, :status,
                                          :client_id, :campaign_id, :assigned_to_id,
                                          :scheduled_at, :published_at, :notes, :media_url)
  end
end
