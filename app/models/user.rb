class User < ApplicationRecord
  has_many :tasks, dependent: :destroy
  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtBlacklist
end
