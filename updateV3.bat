cd "C:/"
cd peClientV3
call pm2 stop all
call git fetch origin v3 && git reset --hard FETCH_HEAD && git clean -df && npm install  && pm2 restart all