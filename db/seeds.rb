# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Task.create(title: "Lorem Ipsum", description: "This is a task!", completed: false, priority: 1, position: 1, due_date: Date.new(2019, 1, 1), tag_list: ["awesome", "slick", "hefty"])
Task.create(title: "Hello World", description: "This is another task!", completed: false, priority: 3, position: 2, due_date: Date.new(2019, 1, 2), tag_list: ["awesome"], ["slick"], ["light"])