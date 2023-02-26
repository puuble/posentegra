cd C:/
call git clone --branch v3 --single-branch https://github.com/puuble/posentegra.git peClientV3
cd peClientV3
call git config --global --add safe.directory C:/peClientV3
call npm install
call npm install pm2 -g
call npm install pm2-windows-startup -g
call pm2-startup install -g
call pm2 start node  --name "PosEntegraV3" -- app.js
call pm2 save
call node ./bin/setup.js