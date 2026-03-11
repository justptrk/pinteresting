class ClientsController < ApplicationController
  before_action :require_login
  before_action :set_client, only: [:show, :edit, :update, :destroy]

  def index
    @clients = Client.all.order(:company_name)
    @clients = @clients.where(status: params[:status]) if params[:status].present?
    @active_count = Client.active.count
    @prospect_count = Client.prospects.count
  end

  def show
    @campaigns = @client.campaigns.order(created_at: :desc)
    @leads = @client.leads.order(created_at: :desc).limit(10)
    @tasks = @client.tasks.where.not(status: 'completed').by_priority.limit(10)
    @content_items = @client.content_items.order(created_at: :desc).limit(10)
    @total_revenue = @client.campaigns.sum(:revenue)
    @total_spent = @client.campaigns.sum(:spent)
  end

  def new
    @client = Client.new
  end

  def create
    @client = Client.new(client_params)
    if @client.save
      track_activity('created', @client)
      flash[:success] = "#{@client.company_name} has been added."
      redirect_to @client
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @client.update(client_params)
      track_activity('updated', @client)
      flash[:success] = "#{@client.company_name} has been updated."
      redirect_to @client
    else
      render :edit
    end
  end

  def destroy
    name = @client.company_name
    @client.destroy
    flash[:info] = "#{name} has been removed."
    redirect_to clients_path
  end

  private

  def set_client
    @client = Client.find(params[:id])
  end

  def client_params
    params.require(:client).permit(:company_name, :industry, :website, :contact_name,
                                    :contact_email, :contact_phone, :address, :status,
                                    :monthly_retainer, :notes, :logo_url, :account_manager_id,
                                    :contract_start_date, :contract_end_date)
  end
end
