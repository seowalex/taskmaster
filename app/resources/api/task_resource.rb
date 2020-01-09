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
    records.order("tasks.completed").order("tasks.title #{direction}")
  end

  sort :priority, apply: ->(records, direction, _context) do
    records.order("tasks.completed").order("tasks.priority #{direction}")
  end

  sort :due_date, apply: ->(records, direction, _context) do
    records.order("tasks.completed").order("tasks.due_date #{direction}")
  end

  def self.records(options = {})
    context = options[:context]
    context[:current_user].tasks
  end

  def self.create(context)
    Api::TaskResource.new(context[:current_user].tasks.new, nil)
  end
end
