class SessionsController < ApplicationController
  def new
  end

  def create
    user = User.find_by(email: params[:email].to_s.downcase)
    if user && user.authenticate(params[:password])
      cookies.permanent[:remember_token] = user.remember_token
      user.update(last_sign_in_at: Time.current)
      flash[:success] = "Welcome back, #{user.first_name}!"
      redirect_to dashboard_path
    else
      flash.now[:danger] = "Invalid email or password."
      render :new
    end
  end

  def destroy
    cookies.delete(:remember_token)
    flash[:info] = "You have been signed out."
    redirect_to root_path
  end
end
