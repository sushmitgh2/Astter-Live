var astterlive, astterliveabi;
const contract_address = "0xd4708cCC178b698cC883aFaCA9A6f2Ef1224Ee6c";
var accounts, hasStream;

var connectBtn = document.getElementById('connect');
var startStream = document.getElementById('start');

async function load() {
    web3 = new Web3(window.ethereum);
    accounts = await web3.eth.getAccounts();
    if(accounts[0] != undefined) {
        //0x0eE25Ea9CdAEAB823F12d3Ef18C097f413E369D7
        connectBtn.innerText = accounts[0].substring(0,4) + "..." +accounts[0].substring(38, 42);
    }

    await fetch('AstterLive.json')
        .then(response => response.json())
        .then(data => {
            astterliveabi = data.abi;
    });

    astterlive = new web3.eth.Contract(astterliveabi, contract_address);
    console.log(accounts);

    hasStream = await astterlive.methods.hasStream(accounts[0]).call({from: accounts[0]});
    console.log(hasStream);
}

startStream.addEventListener('click', (e) => {
    e.preventDefault();
    if(hasStream) {
        window.open('/index.html', "_self");
    }else{
        window.open('/upload_edit.html', "_self");
    }
})

load();