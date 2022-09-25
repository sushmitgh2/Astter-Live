var astterlive, asttercore;
const contract_address = "0x795A5291643354a371FCeb5ae770c2A821920839";
var accounts;
var source = document.getElementById('video_source');
var connectBtn = document.getElementById('connect');


var url = window.location.href;
var url = new URL(url);
var id = url.searchParams.get("id");
console.log(id);

async function load() {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();
    if(accounts[0] != undefined) {
        //0x0eE25Ea9CdAEAB823F12d3Ef18C097f413E369D7
        connectBtn.innerText = accounts[0].substring(0,4) + "..." +accounts[0].substring(38, 42);
    }

    await fetch('build/contracts/AstterLive.json')
        .then(response => response.json())
        .then(data => {
            astterliveabi = data.abi;
    });

    astterlive = new web3.eth.Contract(astterliveabi, contract_address);

    console.log(accounts);

    

    /*var streamer = await astterlive.functions.getStreamer(id).call({from: accounts[0]});
    console.log(streamer);

    document.getElementById('streamer').innerText = streamer;*/

    axios
    .get("https://livepeer.studio/api/stream/"+id, {
        headers: {
        Authorization: "Bearer 81b64de2-c0ef-4d95-a066-6dacbaf6f427",
        },
    })
    .then(async (res) => {
        data = res.data;
        console.log(data);

        source.src = "https://lvpr.tv?v="+data['playbackId'];
        document.getElementById('name').innerText = data['name'];

        var streamer = await astterlive.methods.getStreamer(id).call({from: accounts[0]});
        document.getElementById('streamer').innerText = streamer;
    })
    .catch((error) => {
        console.log(error);
    });

    
}
load();

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
  document.getElementById("message-form").addEventListener("submit", sendMessage);
 
  function sendMessage(e) {
    e.preventDefault();
  
    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;
  
    // clear the input box
    messageInput.value = "";
  
    //auto scroll to bottom
    document
      .getElementById("messages")
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  
    // create db collection and send in the data

    var acc=accounts[0];
    db.ref("messages/"+id+"/"+ timestamp).set({
      acc,
      message,
    });
  }

  const fetchChat = db.ref("messages/"+id);

  fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    var m = messages.acc.substring(0,4) + "..." + messages.acc.substring(37,42);
    const message = `<li>
    <div class="vcp_inf">
        <div class="coments">
            <h2>${m}:<small class="posted_dt">  ${messages.message}</small></h2>
        </div><!--coments end-->
    </div><!--vcp_inf end-->
    </li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
  });

