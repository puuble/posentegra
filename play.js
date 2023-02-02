const { spawn } = require('child_process')
let p = './OnayBekliyor.wav'
function playSound() {
  //const sound = spawn('afplay', ['-v', '100', p])
  const sound = spawn('start', ['mplayer', p])
  sound.on('close', (code) => {
    if (code === 0) {
      // ws.send('played')
      playSound()
    }
  })
}

playSound()
