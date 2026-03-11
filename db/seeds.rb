puts "Seeding MarketPro..."

# Users
admin = User.create!(
  first_name: 'Patrick', last_name: 'Kelly', email: 'patrick@marketpro.com',
  password: 'password123', password_confirmation: 'password123',
  role: 'admin', title: 'CEO & Founder'
)

sarah = User.create!(
  first_name: 'Sarah', last_name: 'Chen', email: 'sarah@marketpro.com',
  password: 'password123', password_confirmation: 'password123',
  role: 'manager', title: 'Marketing Director'
)

mike = User.create!(
  first_name: 'Mike', last_name: 'Rodriguez', email: 'mike@marketpro.com',
  password: 'password123', password_confirmation: 'password123',
  role: 'team_member', title: 'SEO Specialist'
)

jen = User.create!(
  first_name: 'Jennifer', last_name: 'Park', email: 'jen@marketpro.com',
  password: 'password123', password_confirmation: 'password123',
  role: 'team_member', title: 'Content Strategist'
)

puts "  Created #{User.count} users"

# Clients
acme = Client.create!(
  company_name: 'Acme Corp', industry: 'Technology', website: 'https://acmecorp.com',
  contact_name: 'John Smith', contact_email: 'john@acmecorp.com', contact_phone: '555-0101',
  status: 'active', monthly_retainer: 5000, account_manager: sarah,
  contract_start_date: Date.current - 6.months, notes: 'Key enterprise client. Focus on B2B lead gen.'
)

bloom = Client.create!(
  company_name: 'Bloom Boutique', industry: 'E-commerce', website: 'https://bloomboutique.com',
  contact_name: 'Lisa Wang', contact_email: 'lisa@bloomboutique.com', contact_phone: '555-0202',
  status: 'active', monthly_retainer: 3500, account_manager: sarah,
  contract_start_date: Date.current - 3.months, notes: 'DTC fashion brand. Instagram-first strategy.'
)

peak = Client.create!(
  company_name: 'Peak Fitness', industry: 'Health & Fitness', website: 'https://peakfitness.com',
  contact_name: 'Dave Johnson', contact_email: 'dave@peakfitness.com', contact_phone: '555-0303',
  status: 'active', monthly_retainer: 2500, account_manager: admin,
  contract_start_date: Date.current - 1.month
)

nova = Client.create!(
  company_name: 'Nova Financial', industry: 'Finance', website: 'https://novafinancial.com',
  contact_name: 'Rachel Green', contact_email: 'rachel@novafinancial.com',
  status: 'prospect', monthly_retainer: 8000
)

puts "  Created #{Client.count} clients"

# Campaigns
c1 = Campaign.create!(
  name: 'Q1 Google Ads - Lead Gen', client: acme, channel: 'ppc', status: 'active',
  budget: 15000, spent: 8750, start_date: Date.current - 2.months, end_date: Date.current + 1.month,
  objective: 'Generate 200 qualified B2B leads', impressions: 450000, clicks: 12500,
  conversions: 185, revenue: 45000, created_by: sarah
)

c2 = Campaign.create!(
  name: 'Instagram Growth Campaign', client: bloom, channel: 'social', status: 'active',
  budget: 8000, spent: 5200, start_date: Date.current - 1.month, end_date: Date.current + 2.months,
  objective: 'Grow Instagram to 50K followers', impressions: 1200000, clicks: 35000,
  conversions: 420, revenue: 28000, created_by: sarah
)

c3 = Campaign.create!(
  name: 'SEO Content Strategy', client: acme, channel: 'seo', status: 'active',
  budget: 6000, spent: 4000, start_date: Date.current - 3.months,
  objective: 'Rank top 3 for 20 target keywords', impressions: 85000, clicks: 8500,
  conversions: 95, revenue: 18000, created_by: mike
)

c4 = Campaign.create!(
  name: 'Email Nurture Sequence', client: bloom, channel: 'email', status: 'active',
  budget: 2000, spent: 1200, start_date: Date.current - 2.weeks,
  objective: 'Convert abandoned cart users', impressions: 25000, clicks: 4200,
  conversions: 180, revenue: 12000, created_by: jen
)

c5 = Campaign.create!(
  name: 'New Year Fitness Push', client: peak, channel: 'ppc', status: 'completed',
  budget: 5000, spent: 4800, start_date: Date.current - 3.months, end_date: Date.current - 1.month,
  impressions: 320000, clicks: 9800, conversions: 210, revenue: 22000, created_by: sarah
)

c6 = Campaign.create!(
  name: 'YouTube Brand Awareness', client: peak, channel: 'social', status: 'draft',
  budget: 10000, spent: 0, start_date: Date.current + 1.week,
  objective: 'Launch YouTube channel with 12 videos', created_by: admin
)

puts "  Created #{Campaign.count} campaigns"

# Content Items
[
  { title: '10 B2B Lead Gen Strategies for 2026', content_type: 'blog_post', platform: 'website',
    status: 'published', client: acme, campaign: c3, assigned_to: jen,
    scheduled_at: 2.weeks.ago, published_at: 2.weeks.ago },
  { title: 'Spring Collection Launch Post', content_type: 'social_post', platform: 'instagram',
    status: 'scheduled', client: bloom, campaign: c2, assigned_to: jen,
    scheduled_at: 2.days.from_now },
  { title: 'Customer Success Story: Acme Corp', content_type: 'blog_post', platform: 'website',
    status: 'draft', client: acme, campaign: c3, assigned_to: jen },
  { title: 'Weekly Newsletter #14', content_type: 'email', platform: 'email',
    status: 'review', client: bloom, campaign: c4, assigned_to: jen,
    scheduled_at: 3.days.from_now },
  { title: 'Product Demo Video', content_type: 'video', platform: 'youtube',
    status: 'idea', client: peak, campaign: c6, assigned_to: mike },
  { title: 'Google Ads: New Ad Copy Variations', content_type: 'ad_copy', platform: 'google',
    status: 'approved', client: acme, campaign: c1, assigned_to: mike,
    scheduled_at: 1.day.from_now },
  { title: 'LinkedIn Thought Leadership Post', content_type: 'social_post', platform: 'linkedin',
    status: 'scheduled', client: acme, assigned_to: jen,
    scheduled_at: 4.days.from_now },
  { title: 'Summer Sale Campaign Creative', content_type: 'social_post', platform: 'facebook',
    status: 'idea', client: bloom, campaign: c2, assigned_to: jen },
  { title: 'Workout Tips Infographic', content_type: 'infographic', platform: 'instagram',
    status: 'draft', client: peak, assigned_to: mike,
    scheduled_at: 1.week.from_now },
  { title: 'SEO Guide: E-commerce Best Practices', content_type: 'whitepaper', platform: 'website',
    status: 'review', client: bloom, campaign: c2, assigned_to: mike },
].each { |attrs| ContentItem.create!(attrs) }

puts "  Created #{ContentItem.count} content items"

# Leads
[
  { name: 'Tom Wilson', email: 'tom@bigco.com', company: 'BigCo Inc', source: 'paid',
    stage: 'qualified', value: 25000, client: acme, campaign: c1, assigned_to: sarah, score: 72 },
  { name: 'Amy Brooks', email: 'amy@startup.io', company: 'Startup.io', source: 'organic',
    stage: 'proposal', value: 18000, client: acme, campaign: c3, assigned_to: sarah, score: 85 },
  { name: 'Carlos Mendez', email: 'carlos@retail.com', company: 'Retail Plus', source: 'referral',
    stage: 'negotiation', value: 35000, assigned_to: admin, score: 90,
    expected_close_date: 2.weeks.from_now },
  { name: 'Diana Kim', email: 'diana@tech.co', source: 'social',
    stage: 'contacted', value: 12000, client: bloom, campaign: c2, assigned_to: sarah, score: 45 },
  { name: 'Erik Svensson', email: 'erik@nordic.com', company: 'Nordic Health', source: 'event',
    stage: 'new', value: 8000, assigned_to: mike, score: 30 },
  { name: 'Fiona McCarthy', email: 'fiona@agency.com', company: 'Creative Agency', source: 'direct',
    stage: 'won', value: 20000, assigned_to: sarah, score: 95 },
  { name: 'Greg Tanaka', email: 'greg@enterprise.com', company: 'Enterprise Co', source: 'paid',
    stage: 'lost', value: 50000, client: acme, campaign: c1, assigned_to: admin, score: 60 },
  { name: 'Hannah Lee', email: 'hannah@ecom.shop', company: 'E-Com Shop', source: 'organic',
    stage: 'new', value: 6000, client: bloom, assigned_to: jen, score: 25 },
].each { |attrs| Lead.create!(attrs) }

puts "  Created #{Lead.count} leads"

# Tasks
[
  { title: 'Update Acme Google Ads copy', priority: 'high', status: 'in_progress',
    client: acme, campaign: c1, assigned_to: mike, created_by: sarah,
    due_date: Date.current + 2.days, category: 'ads', estimated_hours: 4 },
  { title: 'Design Instagram carousel for Bloom', priority: 'medium', status: 'pending',
    client: bloom, campaign: c2, assigned_to: jen, created_by: sarah,
    due_date: Date.current + 5.days, category: 'design', estimated_hours: 3 },
  { title: 'Write monthly SEO report for Acme', priority: 'high', status: 'pending',
    client: acme, campaign: c3, assigned_to: mike, created_by: sarah,
    due_date: Date.current + 1.day, category: 'analytics', estimated_hours: 2 },
  { title: 'Set up Peak Fitness YouTube channel', priority: 'medium', status: 'pending',
    client: peak, campaign: c6, assigned_to: mike, created_by: admin,
    due_date: Date.current + 7.days, category: 'social', estimated_hours: 5 },
  { title: 'A/B test email subject lines', priority: 'low', status: 'completed',
    client: bloom, campaign: c4, assigned_to: jen, created_by: sarah,
    due_date: Date.current - 3.days, category: 'copywriting', estimated_hours: 2,
    completed_at: 1.day.ago },
  { title: 'Keyword research for Q2 content', priority: 'urgent', status: 'pending',
    client: acme, campaign: c3, assigned_to: mike, created_by: sarah,
    due_date: Date.current - 1.day, category: 'seo', estimated_hours: 6 },
  { title: 'Prepare proposal for Nova Financial', priority: 'high', status: 'in_progress',
    client: nova, assigned_to: admin, created_by: admin,
    due_date: Date.current + 3.days, category: 'strategy', estimated_hours: 8 },
  { title: 'Review Bloom landing page conversion rates', priority: 'medium', status: 'review',
    client: bloom, assigned_to: sarah, created_by: jen,
    due_date: Date.current + 4.days, category: 'analytics', estimated_hours: 3 },
].each { |attrs| Task.create!(attrs) }

puts "  Created #{Task.count} tasks"

# Reports
Report.create!(
  title: 'Acme Corp - February 2026 Monthly Report', report_type: 'monthly',
  client: acme, generated_by: sarah, period_start: Date.current - 1.month,
  period_end: Date.current, status: 'sent',
  summary: "Strong month for Acme Corp. Google Ads campaign exceeded targets with 185 conversions (vs 150 goal). SEO rankings improved for 8 of 20 target keywords. Total revenue attributed: $63,000. Recommend increasing PPC budget by 20% for Q2."
)

Report.create!(
  title: 'Bloom Boutique - Social Media Performance', report_type: 'social',
  client: bloom, generated_by: sarah, period_start: Date.current - 2.weeks,
  period_end: Date.current, status: 'draft',
  summary: "Instagram follower growth: +3,200 (now at 42,800). Engagement rate: 4.2%. Top performing post: Spring Collection teaser (12K likes). Email nurture sequence converting at 7.2% open rate."
)

Report.create!(
  title: 'Peak Fitness - Campaign Wrap-Up', report_type: 'campaign',
  client: peak, generated_by: admin, period_start: Date.current - 3.months,
  period_end: Date.current - 1.month, status: 'final',
  summary: "New Year Fitness Push campaign completed. 210 conversions generated from $4,800 spend (CPA: $22.86). ROAS: 4.58x. Recommend launching YouTube strategy for continued growth."
)

puts "  Created #{Report.count} reports"

# Activities
Activity.create!(user: sarah, action: 'created', trackable: c1, details: 'Created Google Ads campaign')
Activity.create!(user: jen, action: 'created', trackable: ContentItem.first, details: 'Published blog post')
Activity.create!(user: mike, action: 'updated', trackable: c3, details: 'Updated SEO metrics')
Activity.create!(user: admin, action: 'created', trackable: nova, details: 'Added new prospect')

puts "  Created #{Activity.count} activities"
puts ""
puts "Seeding complete!"
puts "Sign in with: patrick@marketpro.com / password123"
