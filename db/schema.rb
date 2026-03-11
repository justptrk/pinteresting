# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2026_03_11_000008) do
  create_table "activities", force: :cascade do |t|
    t.integer "user_id"
    t.string "action", null: false
    t.string "trackable_type"
    t.integer "trackable_id"
    t.text "details"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trackable_type", "trackable_id"], name: "index_activities_on_trackable"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "campaigns", force: :cascade do |t|
    t.string "name", null: false
    t.integer "client_id"
    t.string "channel"
    t.string "status", default: "draft"
    t.decimal "budget", precision: 10, scale: 2
    t.decimal "spent", precision: 10, scale: 2, default: "0.0"
    t.date "start_date"
    t.date "end_date"
    t.text "objective"
    t.text "description"
    t.integer "impressions", default: 0
    t.integer "clicks", default: 0
    t.integer "conversions", default: 0
    t.decimal "revenue", precision: 10, scale: 2, default: "0.0"
    t.decimal "cpc", precision: 8, scale: 2, default: "0.0"
    t.decimal "ctr", precision: 5, scale: 2, default: "0.0"
    t.decimal "roas", precision: 8, scale: 2, default: "0.0"
    t.integer "created_by_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["channel"], name: "index_campaigns_on_channel"
    t.index ["client_id"], name: "index_campaigns_on_client_id"
    t.index ["created_by_id"], name: "index_campaigns_on_created_by_id"
    t.index ["status"], name: "index_campaigns_on_status"
  end

  create_table "clients", force: :cascade do |t|
    t.string "company_name", null: false
    t.string "industry"
    t.string "website"
    t.string "contact_name"
    t.string "contact_email"
    t.string "contact_phone"
    t.text "address"
    t.string "status", default: "active"
    t.decimal "monthly_retainer", precision: 10, scale: 2
    t.text "notes"
    t.string "logo_url"
    t.integer "account_manager_id"
    t.date "contract_start_date"
    t.date "contract_end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_manager_id"], name: "index_clients_on_account_manager_id"
    t.index ["company_name"], name: "index_clients_on_company_name"
    t.index ["status"], name: "index_clients_on_status"
  end

  create_table "content_items", force: :cascade do |t|
    t.string "title", null: false
    t.text "body"
    t.string "content_type"
    t.string "platform"
    t.string "status", default: "idea"
    t.integer "client_id"
    t.integer "campaign_id"
    t.integer "assigned_to_id"
    t.datetime "scheduled_at"
    t.datetime "published_at"
    t.text "notes"
    t.string "media_url"
    t.integer "engagement_score", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assigned_to_id"], name: "index_content_items_on_assigned_to_id"
    t.index ["campaign_id"], name: "index_content_items_on_campaign_id"
    t.index ["client_id"], name: "index_content_items_on_client_id"
    t.index ["content_type"], name: "index_content_items_on_content_type"
    t.index ["scheduled_at"], name: "index_content_items_on_scheduled_at"
    t.index ["status"], name: "index_content_items_on_status"
  end

  create_table "leads", force: :cascade do |t|
    t.string "name", null: false
    t.string "email"
    t.string "phone"
    t.string "company"
    t.string "source"
    t.string "stage", default: "new"
    t.decimal "value", precision: 10, scale: 2
    t.text "notes"
    t.integer "client_id"
    t.integer "campaign_id"
    t.integer "assigned_to_id"
    t.date "expected_close_date"
    t.integer "score", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assigned_to_id"], name: "index_leads_on_assigned_to_id"
    t.index ["campaign_id"], name: "index_leads_on_campaign_id"
    t.index ["client_id"], name: "index_leads_on_client_id"
    t.index ["source"], name: "index_leads_on_source"
    t.index ["stage"], name: "index_leads_on_stage"
  end

  create_table "reports", force: :cascade do |t|
    t.string "title", null: false
    t.string "report_type"
    t.integer "client_id"
    t.integer "generated_by_id"
    t.date "period_start"
    t.date "period_end"
    t.text "summary"
    t.text "metrics_json"
    t.string "status", default: "draft"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_reports_on_client_id"
    t.index ["generated_by_id"], name: "index_reports_on_generated_by_id"
    t.index ["report_type"], name: "index_reports_on_report_type"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "status", default: "pending"
    t.string "priority", default: "medium"
    t.integer "client_id"
    t.integer "campaign_id"
    t.integer "assigned_to_id"
    t.integer "created_by_id"
    t.date "due_date"
    t.datetime "completed_at"
    t.string "category"
    t.integer "estimated_hours"
    t.integer "actual_hours"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assigned_to_id"], name: "index_tasks_on_assigned_to_id"
    t.index ["campaign_id"], name: "index_tasks_on_campaign_id"
    t.index ["client_id"], name: "index_tasks_on_client_id"
    t.index ["created_by_id"], name: "index_tasks_on_created_by_id"
    t.index ["due_date"], name: "index_tasks_on_due_date"
    t.index ["priority"], name: "index_tasks_on_priority"
    t.index ["status"], name: "index_tasks_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "role", default: "team_member"
    t.string "avatar_url"
    t.string "phone"
    t.string "title"
    t.text "bio"
    t.string "remember_token"
    t.datetime "last_sign_in_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["remember_token"], name: "index_users_on_remember_token"
  end

  add_foreign_key "activities", "users"
  add_foreign_key "campaigns", "clients"
  add_foreign_key "content_items", "campaigns"
  add_foreign_key "content_items", "clients"
  add_foreign_key "leads", "campaigns"
  add_foreign_key "leads", "clients"
  add_foreign_key "reports", "clients"
  add_foreign_key "tasks", "campaigns"
  add_foreign_key "tasks", "clients"
end
