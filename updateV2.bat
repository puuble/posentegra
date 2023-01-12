cd "C:/"
cd peClientv2
call git fetch origin v2 && git reset --hard FETCH_HEAD && git clean -df && npm install && node ./bin/update.js && pm2 stop all && pm2 restart all