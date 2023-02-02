const { spawn } = require('child_process')
let p = './OnayBekliyor.wav'
function playSound() {
  //const sound = spawn('afplay', ['-v', '100', p])
  //const sound = spawn('start', ['mplayer', p])
  // const sound = spawn('C:\\Windows\\System32\\cmd.exe', ['/c', 'start', ' Media.SoundPlayer', '/path/to/sound.wav'])
  const sound = spawn('powershell.exe', [
    '-Command',
    '(New-Object Media.SoundPlayer "C:\\peClientV2\\OnayBekliyor.wav").Play(); Start-Sleep -s 3; Exit;',
  ])

  sound.on('close', (code) => {
    if (code === 0) {
      // ws.send('played')
      // playSound()
    }
  })
}

playSound()
