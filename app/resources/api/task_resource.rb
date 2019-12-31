class Api::TaskResource < JSONAPI::Resource
  attributes :title, :description, :completed, :priority, :position, :due_date
end
