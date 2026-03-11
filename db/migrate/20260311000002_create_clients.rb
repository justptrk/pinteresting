class CreateClients < ActiveRecord::Migration
  def change
    create_table :clients do |t|
      t.string :company_name, null: false
      t.string :industry
      t.string :website
      t.string :contact_name
      t.string :contact_email
      t.string :contact_phone
      t.text :address
      t.string :status, default: 'active' # active, inactive, prospect, churned
      t.decimal :monthly_retainer, precision: 10, scale: 2
      t.text :notes
      t.string :logo_url
      t.references :account_manager, index: true
      t.date :contract_start_date
      t.date :contract_end_date
      t.timestamps null: false
    end

    add_index :clients, :status
    add_index :clients, :company_name
  end
end
