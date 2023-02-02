const { spawn, exec } = require('child_process')
let p = './OnayBekliyor.wav'
function playSound() {
  //const sound = spawn('afplay', ['-v', '100', p])
  const sound = spawn('powershell.exe', [
    '-Command',
    "Start-Process powershell.exe -WindowStyle Hidden -ArgumentList '-Command','(New-Object Media.SoundPlayer \"./OnayBekliyor.wav\").Play(); Exit;'",
  ])

  sound.on('close', (code) => {
    if (code === 0) {
      // ws.send('played')
      playSound()
    }
  })
}

exec('C:/peClientV2/images/OnayBekliyor.cmd', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.error(`stderr: ${stderr}`)
})
