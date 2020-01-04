class Api::TaskResource < JSONAPI::Resource
  attributes :title, :description, :completed, :priority, :order, :due_date, :tag_list
  before_update :reorder

  def self.records(options = {})
    context = options[:context]
    context[:current_user].tasks
  end

  def reorder
    if context[:params][:data][:attributes][:order]
      new_order = context[:params][:data][:attributes][:order]

      if @model.order < new_order
        Task.where(user_id: @model.user_id, order: (@model.order + 1)..new_order).each do |task|
          task.order -= 1
          task.save
        end
      elsif @model.order > new_order
        Task.where(user_id: @model.user_id, order: new_order..(@model.order - 1)).each do |task|
          task.order += 1
          task.save
        end
      end
    end
  end
end
