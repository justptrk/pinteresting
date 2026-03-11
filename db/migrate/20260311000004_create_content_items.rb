class CreateContentItems < ActiveRecord::Migration[7.0]
  def change
    create_table :content_items do |t|
      t.string :title, null: false
      t.text :body
      t.string :content_type # blog_post, social_post, email, landing_page, video, infographic, whitepaper, ad_copy
      t.string :platform # facebook, instagram, twitter, linkedin, google, youtube, tiktok, website, email
      t.string :status, default: 'idea' # idea, draft, review, approved, scheduled, published, archived
      t.references :client, index: true, foreign_key: true
      t.references :campaign, index: true, foreign_key: true
      t.references :assigned_to, index: true
      t.datetime :scheduled_at
      t.datetime :published_at
      t.text :notes
      t.string :media_url
      t.integer :engagement_score, default: 0
      t.timestamps null: false
    end

    add_index :content_items, :status
    add_index :content_items, :content_type
    add_index :content_items, :scheduled_at
  end
end
