class Api::TaskResource < JSONAPI::Resource
  attributes :title, :description, :completed, :priority, :position, :due_date, :tag_list
  filter :completed

  filter :search, apply: ->(records, value, _options) {
    search = value.join(",").split(" ").select{ |word| word[0] != "#" }.join(" ")
    tags = value.join(",").scan(/(?:(?<=^#)|(?<=\s#))[^\s]+/)

    if tags.any?
      records.where("title ilike ?", "%#{search}%").tagged_with(tags, wild: true)
    else
      records.where("title ilike ?", "%#{search}%")
    end
  }

  sort :title, apply: ->(records, direction, _context) do
    records.order("completed").order("title #{direction}")
  end

  sort :priority, apply: ->(records, direction, _context) do
    records.order("completed").order("priority #{direction}")
  end

  sort :due_date, apply: ->(records, direction, _context) do
    records.order("completed").order("due_date #{direction}")
  end

  before_update do
    if !context[:params][:data][:attributes][:completed].nil? && @model.completed != context[:params][:data][:attributes][:completed]
      if context[:current_user].tasks.order(:position).find_by(completed: true).nil?
        @model.position = context[:current_user].tasks.count - 1
      elsif @model.completed
        @model.position = context[:current_user].tasks.order(:position).find_by(completed: true).position
      else
        @model.position = context[:current_user].tasks.order(:position).find_by(completed: true).position - 1
      end
    end
  end

  def self.records(options = {})
    context = options[:context]
    context[:current_user].tasks
  end

  def self.create(context)
    Api::TaskResource.new(context[:current_user].tasks.new, nil)
  end
end
