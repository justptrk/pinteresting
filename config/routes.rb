Rails.application.routes.draw do
  root "pages#home"
  get "about" => "pages#about"

  # Authentication
  get    "sign_in"  => "sessions#new",     as: :sign_in
  post   "sign_in"  => "sessions#create",  as: :sessions
  delete "sign_out" => "sessions#destroy", as: :sign_out
  get    "sign_up"  => "users#new",        as: :sign_up

  # Dashboard
  get "dashboard" => "dashboard#index", as: :dashboard

  # Resources
  resources :users, except: [:destroy]

  resources :clients
  resources :campaigns

  resources :content_items do
    collection do
      get :calendar
    end
  end

  resources :leads do
    collection do
      get :pipeline
    end
    member do
      patch :advance
    end
  end

  resources :tasks do
    member do
      patch :complete
    end
  end

  resources :reports
end
