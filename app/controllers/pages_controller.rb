class PagesController < ApplicationController
  def home
  end

  def about
  end

  def game
    render layout: false
  end
end


