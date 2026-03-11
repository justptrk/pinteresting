class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|
      t.string :title, null: false
      t.string :report_type # monthly, weekly, campaign, seo, social, ppc, custom
      t.references :client, index: true, foreign_key: true
      t.references :generated_by, index: true
      t.date :period_start
      t.date :period_end
      t.text :summary
      t.text :metrics_json # stored as JSON text
      t.string :status, default: 'draft' # draft, final, sent
      t.timestamps null: false
    end

    add_index :reports, :report_type
  end
end
