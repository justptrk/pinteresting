class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.references :user, index: true, foreign_key: true
      t.string :action, null: false # created, updated, completed, commented, assigned
      t.references :trackable, polymorphic: true, index: true
      t.text :details
      t.timestamps null: false
    end
  end
end
