class Api::TasksController < ApiController
  before_action :authenticate_user!

  def context
    {
      current_user: User.find(JWT.decode(request.headers['Authorization'].gsub(/^Bearer /, ''), '91dcdba94f9a98e23bd06338d2a94332f3608f5c91afc981efc2e82c6104a6c9190b7a1abbe8b16983f46a38ab67d8b879f8046971bff8b124db5faea1867f0a')[0]['sub'])
    }
  end

  def task_params
    params.require(:task).permit(:title, :description, :completed, :priority, :position, :due_date, :tag_list)
  end
end
