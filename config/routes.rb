Rails.application.routes.draw do
  devise_for :users,
             path: '',
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

  namespace :api do
    jsonapi_resources :tasks, defaults: { format: :json }
  end

  root 'home#index'
  get '*path' => 'home#index'
end
