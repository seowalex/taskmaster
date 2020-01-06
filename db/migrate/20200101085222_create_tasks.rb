class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.text :title, default: ''
      t.text :description, default: ''
      t.boolean :completed, default: false
      t.integer :priority, default: 3
      t.integer :position
      t.date :due_date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
