class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :current_user, :signed_in?

  private

  def current_user
    @current_user ||= User.find_by(remember_token: cookies[:remember_token])
  end

  def signed_in?
    !!current_user
  end

  def require_login
    unless signed_in?
      flash[:warning] = "Please sign in to continue."
      redirect_to sign_in_path
    end
  end

  def require_admin
    unless current_user && current_user.admin?
      flash[:danger] = "Access denied."
      redirect_to root_path
    end
  end

  def track_activity(action, trackable, details = nil)
    return unless current_user
    Activity.create(
      user: current_user,
      action: action,
      trackable: trackable,
      details: details
    )
  end
end
