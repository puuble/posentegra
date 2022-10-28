cd "C:/"
call git clone --branch posentegra --single-branch https://github.com/puuble/posentegra.git peClient
cd peClient
call git config --global --add safe.directory C:/peClient
call npm install
call npm install pm2 -g
call npm install pm2-windows-startup -g
call pm2 start bin\www -n "PosEntegra"
call pm2 save
call node ./bin/setup.js

