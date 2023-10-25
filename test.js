const PusherClient = require("./bin/lib/pusher");
const pusher = new PusherClient();
const player = require("play-sound")();

async function main() {
  await pusher.playSound();
}

player.play("./images/getir.mp3", (error) => {
  if (error) {
    console.error("Error playing sound:", error);
  }
});
