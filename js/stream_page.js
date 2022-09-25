const video = document.getElementById("video");
const button = document.getElementById("button");
video.volume = 0;
const { Client } = webRTMP;

var url = window.location.href;
var url = new URL(url);
var id = url.searchParams.get("id");
console.log(id);

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

  axios
  .get("https://livepeer.studio/api/stream/"+id, {
      headers: {
      Authorization: "Bearer 81b64de2-c0ef-4d95-a066-6dacbaf6f427",
      },
  })
  .then((res) => {
    data = res.data;
    console.log(data);

    const streamKey = data['streamKey'];
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
    })
    .catch((error) => {
        console.log(error);
    });

};