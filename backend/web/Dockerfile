FROM ruby:2.3.1

# check Dockerfile.development for development version of dockerfile

RUN gem install bundler

# Preinstall gems. This will ensure that Gem Cache wont drop on code change
WORKDIR /tmp
ADD ./Gemfile Gemfile
ADD ./Gemfile.lock Gemfile.lock
RUN (bundle check || bundle install --without development test)

RUN mkdir /app
ADD . /app
WORKDIR /app
RUN (bundle check || bundle install --without development test)

ARG DEVISE_SECRET_KEY
ARG PAPER_CLIP_S3_HOST_NAME
ARG PAPER_CLIP_S3_BUCKET_NAME
ARG PAPER_CLIP_AWS_ACCESS_KEY_ID
ARG PAPER_CLIP_AWS_SECRET_ACCESS_KEY
ARG PAPER_CLIP_AWS_REGION

RUN DB_ADAPTER=nulldb RAILS_ENV=production bundle exec rake assets:precompile

CMD bash script/start_server.sh
