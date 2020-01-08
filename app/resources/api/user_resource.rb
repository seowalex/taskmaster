class Api::UserResource < JSONAPI::Resource
  attributes :name, :settings

  def self.records(options = {})
    context = options[:context]
    context[:current_user]
  end
end
