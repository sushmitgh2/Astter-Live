const video = document.getElementById("video");
const button = document.getElementById("button");
video.volume = 0;
const { Client } = webRTMP;

web3 = new Web3(window.ethereum);
addr = await web3.eth.getAccounts()[0];

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

    const name = data['name'];
    var firebaseConfig = {
      apiKey: "AIzaSyBiT5tAohBkKSdufROFxE3hnnplpDhgeHE",
      authDomain: "aster-live.firebaseapp.com",
      databaseURL: "https://aster-live-default-rtdb.firebaseio.com",
      projectId: "aster-live",
      storageBucket: "aster-live.appspot.com",
      messagingSenderId:"517213286156",
      appId: "1:517213286156:web:d2d1a3757cc2af92dfe329",
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    
      db.ref("live_streams/"+id).set({
        id,
        name,
        addr,
      });


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