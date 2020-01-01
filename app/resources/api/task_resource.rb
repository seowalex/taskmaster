class Api::TaskResource < JSONAPI::Resource
  attributes :title, :description, :completed, :priority, :position, :due_date, :tag_list

  def self.records(options = {})
    context = options[:context]
    context[:current_user].tasks
  end
end
