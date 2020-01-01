class ApiController < JSONAPI::ResourceController
  before_action :authenticate_user!
  protect_from_forgery with: :null_session

  def index
    process_request
  end
end
