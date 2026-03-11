class CreateCampaigns < ActiveRecord::Migration
  def change
    create_table :campaigns do |t|
      t.string :name, null: false
      t.references :client, index: true, foreign_key: true
      t.string :channel # seo, ppc, social, email, content, display, affiliate
      t.string :status, default: 'draft' # draft, active, paused, completed, cancelled
      t.decimal :budget, precision: 10, scale: 2
      t.decimal :spent, precision: 10, scale: 2, default: 0
      t.date :start_date
      t.date :end_date
      t.text :objective
      t.text :description
      t.integer :impressions, default: 0
      t.integer :clicks, default: 0
      t.integer :conversions, default: 0
      t.decimal :revenue, precision: 10, scale: 2, default: 0
      t.decimal :cpc, precision: 8, scale: 2, default: 0
      t.decimal :ctr, precision: 5, scale: 2, default: 0
      t.decimal :roas, precision: 8, scale: 2, default: 0
      t.references :created_by, index: true
      t.timestamps null: false
    end

    add_index :campaigns, :status
    add_index :campaigns, :channel
  end
end
