cd C:/
call git clone --branch v2 --single-branch https://github.com/puuble/posentegra.git peClientV2
cd peClientV2
call git config --global --add safe.directory C:/peClientV2
call npm install
call npm install pm2 -g
call npm install pm2-windows-startup -g
call pm2-startup install -g
call pm2 start bin\www -n "PosEntegraV2"
call pm2 save
call node ./bin/setup.js