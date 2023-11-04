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
const Speaker = require("speaker");
const fs = require("fs");

// Create a readable stream from your MP3 sound file
const soundFile = fs.createReadStream("./images/getir.mp3");

// Create a speaker instance to play the audio
const speaker = new Speaker({
  channels: 2, // Stereo (change as needed)
  bitDepth: 16, // 16-bit (change as needed)
  sampleRate: 44100, // 44.1kHz (change as needed)
});

// Pipe the MP3 sound file to the speaker
soundFile.pipe(speaker);

// Handle any errors
speaker.on("error", (err) => {
  console.error("Error playing sound:", err);
});

// Listen for when the sound has finished playing
speaker.on("close", () => {
  console.log("Sound finished playing");
});
