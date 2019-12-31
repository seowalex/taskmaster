class Api::TasksController < ApplicationController
  def task_params
    params.require(:task).permit(:title, :description, :completed, :priority, :position, :due_date, :tag_list)
  end
end
