class Api::UserResource < JSONAPI::Resource
  attributes :name, :settings, :password

  def fetchable_fields
    super - [:password]
  end

  def self.records(options = {})
    context = options[:context]
    context[:current_user]
  end
end
