# Taskmaster

Taskmaster is a simple to-do app built on Rails, React, Typescript and PostgreSQL as part of the Computing for Voluntary Welfare Organisations (CVWO) assignment.

Features include:
* User accounts
* Task categorisation using tags
* Task priorities
* Task sorting using an intuitive drag and drop interface

## Getting Started
### Requirements
* `node` (v12.16.3)
* `ruby` (v2.6.5)
* `postgresql` (v12.3)
* `yarn` (v1.22.4)

### Setup
1. Install dependencies
```
bundle install
yarn install
```
2. Generate Rails credentials
```
bundle exec rails credentials:edit
```
3. Setup database
```
bundle exec rails db:create
bundle exec rails db:migrate
bundle exec rails db:seed
```
4. Run application
```
bundle exec rails s
bin/webpack-dev-server
yarn watch-typings
```
