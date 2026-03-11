class CreateTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.string :status, default: 'pending' # pending, in_progress, review, completed, cancelled
      t.string :priority, default: 'medium' # low, medium, high, urgent
      t.references :client, index: true, foreign_key: true
      t.references :campaign, index: true, foreign_key: true
      t.references :assigned_to, index: true
      t.references :created_by, index: true
      t.date :due_date
      t.datetime :completed_at
      t.string :category # design, development, copywriting, seo, analytics, social, ads, strategy
      t.integer :estimated_hours
      t.integer :actual_hours
      t.timestamps null: false
    end

    add_index :tasks, :status
    add_index :tasks, :priority
    add_index :tasks, :due_date
  end
end
