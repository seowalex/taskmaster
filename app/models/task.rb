class Task < ApplicationRecord
  belongs_to :user
  acts_as_taggable
  acts_as_list scope: :user
end
