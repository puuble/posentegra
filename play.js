const { spawn } = require('child_process')
let p = './OnayBekliyor.wav'
function playSound() {
  //const sound = spawn('afplay', ['-v', '100', p])
  //const sound = spawn('start', ['mplayer', p])
  const sound = spawn('C:\\Windows\\System32\\cmd.exe', ['/c', 'start', 'mplayer', '/path/to/sound.wav'])
  sound.on('close', (code) => {
    if (code === 0) {
      // ws.send('played')
      playSound()
    }
  })
}

playSound()
