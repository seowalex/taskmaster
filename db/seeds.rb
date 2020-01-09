# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

if Rails.env.development?
  @alice = User.create(email: 'alice@example.com', password: 'password', name: 'Alice')
  @bob = User.create(email: 'bob@example.com', password: 'password', name: 'Bob')

  5.times do
    @alice.tasks.create(title: Faker::Books::Lovecraft.sentence.delete_suffix('.'), description: Faker::Books::Lovecraft.paragraph, completed: Faker::Boolean.boolean, priority: Faker::Number.within(range: 1..3), due_date: Faker::Date.in_date_period, tag_list: Faker::Books::Lovecraft.words)
  end

  5.times do
    @bob.tasks.create(title: Faker::Books::Lovecraft.sentence.delete_suffix('.'), description: Faker::Books::Lovecraft.paragraph, completed: Faker::Boolean.boolean, priority: Faker::Number.within(range: 1..3), due_date: Faker::Date.in_date_period, tag_list: Faker::Books::Lovecraft.words)
  end
end
