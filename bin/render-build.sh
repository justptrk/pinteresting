#!/usr/bin/env bash
set -o errexit

# Install Node.js for asset compilation
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs || true

bundle install
bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rake db:migrate
bundle exec rake db:seed
