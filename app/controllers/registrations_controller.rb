class RegistrationsController < Devise::RegistrationsController
  protect_from_forgery with: :null_session
  respond_to :json
end
