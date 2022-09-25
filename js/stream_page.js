const video = document.getElementById("video");
const button = document.getElementById("button");
video.volume = 0;
const { Client } = webRTMP;

let stream;
async function setup() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  video.srcObject = stream;
  video.play();
}

setup();

button.onclick = () => {
  const streamKey = "f98d-1u47-8fud-593m";
  if (!stream) {
    alert("Video stream not initialized yet.");
  }

  if (!streamKey) {
    alert("Invalid streamKey.");
    return;
  }
  const client = new Client();
  const session = client.cast(stream, streamKey);

  session.on("close", () => {
    console.log("Stream stopped.");
  });

  session.on("error", (err) => {
    console.log("Stream error.", err.message);
  });
};