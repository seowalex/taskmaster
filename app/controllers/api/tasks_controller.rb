class Api::TasksController < ApiController
  before_action :authenticate_user!

  def context
    {
      current_user: User.find(JWT.decode(request.headers['Authorization'].gsub(/^Bearer /, ''), Rails.application.credentials.secret_key_base)[0]['sub']),
      params: params
    }
  end
end
