Rails.application.routes.draw do
  devise_for :users,
             path: 'api',
             path_names: {
               sign_in: 'login',
               sign_out: 'logout',
               registration: 'signup'
             },
             controllers: {
               sessions: 'sessions',
               registrations: 'registrations'
             },
             defaults: { format: :json }

  namespace :api, defaults: { format: :json } do
    jsonapi_resources :tasks
    jsonapi_resources :users
  end

  root 'home#index'
  get '*path' => 'home#index'
end
