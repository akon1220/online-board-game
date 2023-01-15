#! /bin/bash

set -eu

service nginx restart

cd /app/ && pm2-runtime /app/server/dist/server.js
