class Api::TaskResource < JSONAPI::Resource
  attributes :title, :description, :completed, :priority, :position, :due_date, :tag_list

  filter :search, apply: ->(records, value, _options) {
    # TODO: Use regex and filter out into function
    search = value.join(",").split(" ").select{ |word| word[0] != "#" }.join(" ")
    tags = value.join(",").scan(/(?:(?<=^#)|(?<=\s#))\w+(?=$|\s)/)

    if tags.any?
      records.where("title ilike ?", "%#{search}%").tagged_with(tags, wild: true)
    else
      records.where("title ilike ?", "%#{search}%")
    end
  }

  def self.records(options = {})
    context = options[:context]
    context[:current_user].tasks
  end
end
