class Api::TasksController < ApiController
  before_action :authenticate_user!

  def context
    {
      current_user: User.find(JWT.decode(request.headers['Authorization'].gsub(/^Bearer /, ''), Rails.application.credentials.secret_key_base)[0]['sub']),
      params: params
    }
  end

  def task_params
    params.require(:task).permit(:title, :description, :completed, :priority, :position, :due_date, :tag_list)
  end
end
