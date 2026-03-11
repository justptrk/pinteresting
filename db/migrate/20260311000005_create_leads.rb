class CreateLeads < ActiveRecord::Migration[7.0]
  def change
    create_table :leads do |t|
      t.string :name, null: false
      t.string :email
      t.string :phone
      t.string :company
      t.string :source # organic, paid, referral, social, email, direct, event
      t.string :stage, default: 'new' # new, contacted, qualified, proposal, negotiation, won, lost
      t.decimal :value, precision: 10, scale: 2
      t.text :notes
      t.references :client, index: true, foreign_key: true
      t.references :campaign, index: true, foreign_key: true
      t.references :assigned_to, index: true
      t.date :expected_close_date
      t.integer :score, default: 0
      t.timestamps null: false
    end

    add_index :leads, :stage
    add_index :leads, :source
  end
end
