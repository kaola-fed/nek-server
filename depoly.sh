#!/usr/bin/env bash
git pull origin develop
cd ./core
npm run build
cd ..
npm i
npm i ./core -S
npm run build
pm2 restart pm2.json
