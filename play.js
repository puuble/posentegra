const { spawn } = require('child_process')
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

playSound()