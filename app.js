let audioCtx,
  buffer,
  source,
  speed = 1;
const body = document.body,
  play = document.getElementById("play"),
  stop = document.getElementById("stop");

document.addEventListener("DOMContentLoaded", function () {
  window.scrollTo(0, document.body.scrollHeight / 2.5);
});

gsap.to("body", {
  opacity: 1,
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.05,
    onLeave: function () {
      window.scrollTo(0, 0);
    },
    onScrubComplete: (self) => {
      speed = 1;
      body.style.setProperty("--cursor", "grab");
      if (play.disabled === true) {
        source.playbackRate.value = speed;
        body.style.setProperty("--speed", 1);
      }
      if (self.progress === 0) {
        window.scrollTo(0, document.body.scrollHeight);
      }
    },
    onUpdate: ({ getVelocity }) => {
      if (getVelocity() < 1) {
        speed = Math.max(1 - Math.abs(getVelocity() / 3000), 0.05);
        body.style.setProperty("--speed", speed);
      } else {
        speed = 1 + Math.abs(getVelocity() / 3000);
        body.style.setProperty("--speed", speed);
      }
      if (play.disabled === true) {
        body.style.setProperty("--cursor", "grabbing");
        source.playbackRate.value = speed;
      }
    }
  }
});

async function loadAudio() {
  try {
    // Load an audio file
    const response = await fetch(
      "ambient.mp3"
    );
    // Decode it
    buffer = await audioCtx.decodeAudioData(await response.arrayBuffer());
  } catch (err) {
    console.error(`Unable to fetch the audio file. Error: ${err.message}`);
  }
}

play.addEventListener("click", async () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    secondaryCtx = new AudioContext();
    await loadAudio();
  }
  body.classList.add("playing");
  setTimeout(() => {
    source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.loop = true;
    source.start();
    play.disabled = true;
  }, 1000);
});

stop.addEventListener("click", async () => {
  body.classList.remove("playing");
  source.stop();
  play.disabled = false;
});
