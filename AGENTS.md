# AGENTS.md

## Cursor Cloud specific instructions

This is a Ruby on Rails 4.2.1 application ("Pinteresting" — a Pinterest clone tutorial). It uses Ruby 2.3.8 managed via rbenv.

### Ruby version management
- Ruby 2.3.8 is installed via **rbenv** at `~/.rbenv/versions/2.3.8`
- rbenv is initialized in `~/.bashrc`; new shells have `ruby`, `gem`, `bundle` available automatically
- Ruby 2.3.8 requires OpenSSL 1.0.2u (compiled alongside it by ruby-build) since the system ships OpenSSL 3.x

### Common commands
- **Install deps**: `bundle install` (uses Bundler 1.17.x; Gemfile.lock requires Bundler < 2.0)
- **Run tests**: `bin/rake test` (Minitest)
- **Start dev server**: `bin/rails server -b 0.0.0.0 -p 3000`
- **DB migrate**: `bin/rake db:migrate`
- **Rails console**: `bin/rails console`

### Gotchas
- The `rdoc` gem in `Gemfile.lock` is pinned to 4.2.0 but has an undeclared dependency. If `bundle install` fails on rdoc, run `bundle update rdoc` first, then `bundle install`.
- The database is SQLite3 (file-based, no external DB server needed). Database files live in `db/`.
- Node.js (available via nvm) is required for the `execjs` gem used by CoffeeScript/Uglifier asset compilation.
- No external services, APIs, or environment variables are required for local development.
