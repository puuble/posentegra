cd "C:/"
cd peClient
call git fetch origin posentegra && git reset --hard FETCH_HEAD && git clean -df && npm install && node ./bin/update.js && pm2 restart all