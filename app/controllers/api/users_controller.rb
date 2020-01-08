class Api::UsersController < ApiController
  before_action :authenticate_user!

  def context
    {
      current_user: User.where(id: JWT.decode(request.headers['Authorization'].gsub(/^Bearer /, ''), Rails.application.credentials.secret_key_base)[0]['sub']),
      params: params
    }
  end

  def task_params
    params.require(:user).permit(:name, :settings)
  end
end
