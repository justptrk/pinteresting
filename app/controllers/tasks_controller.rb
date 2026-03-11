class TasksController < ApplicationController
  before_action :require_login
  before_action :set_task, only: [:show, :edit, :update, :destroy, :complete]

  def index
    @tasks = Task.all.includes(:client, :campaign, :assigned_to).by_priority
    @tasks = @tasks.where(status: params[:status]) if params[:status].present?
    @tasks = @tasks.where(assigned_to_id: params[:user_id]) if params[:user_id].present?
    @tasks = @tasks.where(category: params[:category]) if params[:category].present?
    @overdue_count = Task.overdue.count
    @today_count = Task.due_today.count
  end

  def show
  end

  def new
    @task = Task.new
    @task.client_id = params[:client_id] if params[:client_id]
    @task.campaign_id = params[:campaign_id] if params[:campaign_id]
  end

  def create
    @task = Task.new(task_params)
    @task.created_by = current_user
    if @task.save
      track_activity('created', @task)
      flash[:success] = "Task '#{@task.title}' has been created."
      redirect_to @task
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @task.update(task_params)
      track_activity('updated', @task)
      flash[:success] = "Task updated successfully."
      redirect_to @task
    else
      render :edit
    end
  end

  def complete
    @task.update(status: 'completed', completed_at: Time.current)
    track_activity('completed', @task)
    flash[:success] = "Task marked as completed!"
    redirect_to tasks_path
  end

  def destroy
    @task.destroy
    flash[:info] = "Task has been removed."
    redirect_to tasks_path
  end

  private

  def set_task
    @task = Task.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :status, :priority, :client_id,
                                  :campaign_id, :assigned_to_id, :due_date, :category,
                                  :estimated_hours, :actual_hours)
  end
end
