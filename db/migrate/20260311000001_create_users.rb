class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :role, default: 'team_member' # admin, manager, team_member
      t.string :avatar_url
      t.string :phone
      t.string :title
      t.text :bio
      t.string :remember_token
      t.datetime :last_sign_in_at
      t.timestamps null: false
    end

    add_index :users, :email, unique: true
    add_index :users, :remember_token
  end
end
