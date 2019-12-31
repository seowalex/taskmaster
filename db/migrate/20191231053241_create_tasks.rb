class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.text :title
      t.text :description
      t.boolean :completed
      t.integer :priority
      t.integer :position
      t.date :due_date

      t.timestamps
    end
  end
end
