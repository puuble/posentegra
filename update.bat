cd "C:/peClient"

call git fetch origin posentegra
call git reset --hard FETCH_HEAD
call git clean -df
call npm install
call pm2 restart all


