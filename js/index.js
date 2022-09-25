var connectBtn = document.getElementById('connect')
var astterlive, asttercore;

const contract_address = "0xd4708cCC178b698cC883aFaCA9A6f2Ef1224Ee6c";
var liveRow = document.getElementById('live');

var firebaseConfig = {
    apiKey: "AIzaSyBiT5tAohBkKSdufROFxE3hnnplpDhgeHE",
    authDomain: "aster-live.firebaseapp.com",
    databaseURL: "https://aster-live-default-rtdb.firebaseio.com",
    projectId: "aster-live",
    storageBucket: "aster-live.appspot.com",
    messagingSenderId:"517213286156",
    appId: "1:517213286156:web:d2d1a3757cc2af92dfe329",
};

connectBtn.addEventListener('click', async() => {

    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
        accounts = await web3.eth.getAccounts();
    } else {
        console.log("No wallet");
    }

    if(accounts[0] != undefined) {
        //0x0eE25Ea9CdAEAB823F12d3Ef18C097f413E369D7
        connectBtn.innerText = accounts[0].substring(0,4) + "..." +accounts[0].substring(38, 42);
    }    

    await fetch('../build/contracts/AstterLive.json')
        .then(response => response.json())
        .then(data => {
            astterlive = data.abi;
    });

    console.log(accounts);
})

async function load() {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();
    if(accounts[0] != undefined) {
        //0x0eE25Ea9CdAEAB823F12d3Ef18C097f413E369D7
        connectBtn.innerText = accounts[0].substring(0,4) + "..." +accounts[0].substring(38, 42);
    }

    await fetch('../build/contracts/AstterLive.json')
        .then(response => response.json())
        .then(data => {
            astterliveabi = data.abi;
    });

    astterlive = new web3.eth.Contract(astterliveabi, contract_address);

    console.log(accounts);
}

const loadUI = async() => {
    var id = "f98d3104-e971-46bc-9a51-5ae2b8584c63";
    liveRow.innerHTML += '<div class="col-lg-3 col-md-6 col-sm-6 col-6 full_wdth"><div class="videoo"><div class="vid_thumbainl"><a href="single_video_page.html?id='+id+'" title=""><img src="images/resources/vide4.png" alt=""></a> </div><!--vid_thumbnail end--> <div class="video_info"> <h3><a href="single_video_page.html?id='+id+'" title="">Top 5 Amazing Bridge Block ever in PUBG</a></h3> <h4><a href="Single_Channel_Home.html" title="">Maketzi</a> </h4> </div> </div><!--videoo end--> </div>'
}

loadUI();

/*
<div class="col-lg-3 col-md-6 col-sm-6 col-6 full_wdth">
    <div class="videoo">
        <div class="vid_thumbainl">
            <a href="single_video_page.html" title="">
                <img src="images/resources/vide4.png" alt="">
                <span class="vid-time">5:25</span>
                
            </a>	
        </div><!--vid_thumbnail end-->
        <div class="video_info">
            <h3><a href="single_video_page.html" title="">Top 5 Amazing Bridge Block ever in PUBG</a></h3>
            <h4><a href="Single_Channel_Home.html" title="">Maketzi</a> </h4>
            <span>612K views .<small class="posted_dt">5 months ago</small></span>
        </div>
    </div><!--videoo end-->
</div>

*/

load();