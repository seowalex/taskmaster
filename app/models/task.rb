class Task < ApplicationRecord
  belongs_to :user
  acts_as_taggable
  acts_as_list scope: :user, top_of_list: 0
end
