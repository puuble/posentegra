const { exec } = require('child_process')

exec(
  'git clone https://github.com/puuble/posentegra.git peClient',
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      exec(
        'cd peClient && npm install && npm install pm2 -g && npm install pm2-windows-startup -g &&  pm2 start binwww -n "PosEntegra" && pm2 save ',
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`)
            return
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
          }
          console.log(`stdout: ${stdout}`)
        }
      )
      return
    }
    console.log(`stdout: ${stdout}`)
  }
)
