var astterlive, asttercore;
const contract_address = "0x11C8Fa38a4302a476088d95b51918A341b19C2c6";

var source = document.getElementById('video_source');
var connectBtn = document.getElementById('connect')

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

    var url = window.location.href;
    var url = new URL(url);
    var id = url.searchParams.get("id");
    console.log(id);

    axios
    .get("https://livepeer.studio/api/stream/"+id, {
        headers: {
        Authorization: "Bearer e608f0f9-338f-431a-8538-a798b2d8c8f5",
        },
    })
    .then((res) => {
        data = res.data;
        console.log(data);

        source.src = "https://lvpr.tv?v="+data['playbackId'];
    })
    .catch((error) => {
        console.log(error);
    });
}

load();
