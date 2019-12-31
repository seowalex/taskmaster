Rails.application.routes.draw do
  namespace :api do
    jsonapi_resources :tasks
  end

  root 'home#index'
  get '*path' => 'home#index'
end
