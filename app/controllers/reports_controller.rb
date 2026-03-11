class ReportsController < ApplicationController
  before_action :require_login
  before_action :set_report, only: [:show, :edit, :update, :destroy]

  def index
    @reports = Report.all.includes(:client, :generated_by).order(created_at: :desc)
    @reports = @reports.where(client_id: params[:client_id]) if params[:client_id].present?
  end

  def show
  end

  def new
    @report = Report.new
    @report.client_id = params[:client_id] if params[:client_id]
    @report.period_start = Date.current.beginning_of_month
    @report.period_end = Date.current.end_of_month
  end

  def create
    @report = Report.new(report_params)
    @report.generated_by = current_user
    if @report.save
      track_activity('created', @report)
      flash[:success] = "Report '#{@report.title}' has been created."
      redirect_to @report
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @report.update(report_params)
      flash[:success] = "Report updated successfully."
      redirect_to @report
    else
      render :edit
    end
  end

  def destroy
    @report.destroy
    flash[:info] = "Report has been removed."
    redirect_to reports_path
  end

  private

  def set_report
    @report = Report.find(params[:id])
  end

  def report_params
    params.require(:report).permit(:title, :report_type, :client_id, :period_start,
                                    :period_end, :summary, :metrics_json, :status)
  end
end
