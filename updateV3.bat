cd "C:/"
cd peClientv2
call pm2 stop all
call git fetch origin v3 && git reset --hard FETCH_HEAD && git clean -df && npm install && node ./bin/update.js && pm2 restart all