class UsersController < ApplicationController
  before_action :require_login, except: [:new, :create]
  before_action :require_admin, only: [:index]
  before_action :set_user, only: [:show, :edit, :update]

  def index
    @users = User.all.order(:first_name)
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      cookies.permanent[:remember_token] = @user.remember_token
      flash[:success] = "Welcome to MarketPro! Your account has been created."
      redirect_to dashboard_path
    else
      render :new
    end
  end

  def show
    @recent_tasks = @user.assigned_tasks.order(created_at: :desc).limit(5)
    @recent_activities = Activity.where(user: @user).recent
  end

  def edit
  end

  def update
    if @user.update(user_params)
      flash[:success] = "Profile updated successfully."
      redirect_to @user
    else
      render :edit
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password,
                                  :password_confirmation, :phone, :title, :bio, :role)
  end
end
