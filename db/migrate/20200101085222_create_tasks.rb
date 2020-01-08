class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.text :title, null: false, default: ''
      t.text :description, null: false, default: ''
      t.boolean :completed, null: false, default: false
      t.integer :priority, null: false, default: 3
      t.integer :position, null: false
      t.date :due_date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
