cd "C:/"
call git clone https://github.com/puuble/posentegra.git peClient
cd peClient
call npm install
call npm install pm2 -g
call npm install pm2-windows-startup -g
call pm2 start bin\www -n "PosEntegra"
call pm2 save

