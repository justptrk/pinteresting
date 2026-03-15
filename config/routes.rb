Rails.application.routes.draw do
  root "dashboard#index"

  get "about" => "pages#about"

  # Dashboard API endpoints
  get "api/cloudtalk" => "dashboard#api_cloudtalk"
  get "api/manatal" => "dashboard#api_manatal"
  get "api/apollo" => "dashboard#api_apollo"
  get "api/pipeline" => "dashboard#api_pipeline"
  get "api/gmail" => "dashboard#api_gmail"
  get "api/overview" => "dashboard#api_overview"
end
