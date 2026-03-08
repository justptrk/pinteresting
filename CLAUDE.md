# CLAUDE.md — Pinteresting

## Project Overview

Pinteresting is a Ruby on Rails 4.2.1 sample application built for the One Month Rails tutorial. It demonstrates basic Rails concepts (routing, controllers, views, layouts) through a Pinterest-like web app.

**Current state**: Early-stage tutorial project with static pages (home, about). No data models, authentication, or database migrations exist yet.

## Tech Stack

- **Framework**: Ruby on Rails 4.2.1
- **Language**: Ruby
- **Database**: SQLite3
- **Views**: ERB templates
- **Stylesheets**: SCSS (via sass-rails)
- **JavaScript**: CoffeeScript, jQuery, Turbolinks
- **Package Manager**: Bundler
- **Test Framework**: Minitest (Rails default)

## Common Commands

```bash
# Install dependencies
bundle install

# Start development server
bin/rails server

# Run all tests
bundle exec rake test

# Run a specific test file
ruby -I test test/controllers/pages_controller_test.rb

# Database operations
bundle exec rake db:setup       # Create, migrate, seed
bundle exec rake db:migrate     # Run pending migrations
bundle exec rake db:seed        # Seed data

# Useful utilities
bin/rails console               # Interactive Rails console
bundle exec rake routes         # Show all routes
bundle exec rake assets:precompile  # Precompile assets for production
```

## Project Structure

```
app/
├── assets/                  # Images, JS (CoffeeScript), CSS (SCSS)
├── controllers/
│   ├── application_controller.rb   # Base controller (CSRF protection)
│   └── pages_controller.rb         # Static pages (home, about)
├── helpers/                 # View helpers
├── mailers/                 # (empty)
├── models/                  # (empty — no models yet)
└── views/
    ├── layouts/application.html.erb  # Main layout
    └── pages/                        # home.html.erb, about.html.erb
config/
├── routes.rb                # Root → pages#home, /about → pages#about
├── database.yml             # SQLite3 config (dev/test/production)
├── secrets.yml              # Secret keys (production uses ENV)
└── environments/            # Per-environment settings
db/                          # Migrations (empty), seeds, SQLite files
test/                        # Minitest tests
├── controllers/             # Controller tests
├── models/                  # Model tests
├── integration/             # Integration tests
└── test_helper.rb           # Test configuration
```

## Routes

| Path   | Controller#Action | Helper       |
|--------|-------------------|--------------|
| `/`    | `pages#home`      | `root_path`  |
| `/about` | `pages#about`   | `about_path` |

## Key Conventions

- **MVC pattern**: Follow standard Rails conventions — models in `app/models/`, controllers in `app/controllers/`, views in `app/views/`.
- **Naming**: Controllers are PascalCase (`PagesController`), files are snake_case (`pages_controller.rb`).
- **Views**: Use `.html.erb` templates. Shared layout lives in `app/views/layouts/application.html.erb`.
- **Routes**: Use Rails route helpers (`root_path`, `about_path`) instead of hardcoded URLs.
- **Assets**: JS manifest in `app/assets/javascripts/application.js`, CSS manifest in `app/assets/stylesheets/application.css`.
- **Tests**: One test file per controller/model, placed in the matching `test/` subdirectory.

## Database

SQLite3 for all environments. Database files are gitignored (`db/*.sqlite3`). No migrations or models exist yet — the app only serves static pages.

## Environment Notes

- Development: Code auto-reloads, full error pages, no caching.
- Test: Separate `test.sqlite3` database, randomized test order.
- Production: Requires `SECRET_KEY_BASE` env var. Assets must be precompiled. No SSL enforcement by default.
