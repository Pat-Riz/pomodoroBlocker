chrome.runtime.onMessage.addListener((msg) => {
  if (msg.target !== "offscreen") {
    return false;
  }

  console.log("Message recived in offscreen", msg);
  switch (msg.action) {
    case "playSound":
      playAudio(msg.source, msg.volume);
      break;
  }
});

const audio = document.querySelector("audio");

function playAudio(source, volume) {
  const file = source || "timer_end.mp3";

  audio.src = file;
  audio.volume = volume;

  audio.play();
}
