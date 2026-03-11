class LeadsController < ApplicationController
  before_action :require_login
  before_action :set_lead, only: [:show, :edit, :update, :destroy, :advance]

  def index
    @leads = Lead.all.includes(:client, :campaign, :assigned_to).order(created_at: :desc)
    @leads = @leads.where(stage: params[:stage]) if params[:stage].present?
    @leads = @leads.where(source: params[:source]) if params[:source].present?
    @total_pipeline_value = Lead.active.sum(:value)
    @won_value = Lead.won.sum(:value)
  end

  def pipeline
    @leads_by_stage = {}
    Lead::STAGES.each do |stage|
      @leads_by_stage[stage] = Lead.where(stage: stage).includes(:client, :assigned_to).order(created_at: :desc)
    end
  end

  def show
  end

  def new
    @lead = Lead.new
    @lead.client_id = params[:client_id] if params[:client_id]
    @lead.campaign_id = params[:campaign_id] if params[:campaign_id]
  end

  def create
    @lead = Lead.new(lead_params)
    if @lead.save
      track_activity('created', @lead)
      flash[:success] = "Lead '#{@lead.name}' has been added."
      redirect_to @lead
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @lead.update(lead_params)
      track_activity('updated', @lead)
      flash[:success] = "Lead updated successfully."
      redirect_to @lead
    else
      render :edit
    end
  end

  def advance
    current_index = Lead::STAGES.index(@lead.stage)
    if current_index && current_index < Lead::STAGES.length - 1
      next_stage = Lead::STAGES[current_index + 1]
      @lead.update(stage: next_stage)
      track_activity('advanced', @lead, "to #{next_stage}")
      flash[:success] = "Lead advanced to #{next_stage.titleize}."
    end
    redirect_to @lead
  end

  def destroy
    @lead.destroy
    flash[:info] = "Lead has been removed."
    redirect_to leads_path
  end

  private

  def set_lead
    @lead = Lead.find(params[:id])
  end

  def lead_params
    params.require(:lead).permit(:name, :email, :phone, :company, :source, :stage,
                                  :value, :notes, :client_id, :campaign_id,
                                  :assigned_to_id, :expected_close_date, :score)
  end
end
