var astterlive, astterliveabi;
const contract_address = "0x795A5291643354a371FCeb5ae770c2A821920839";
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

    await fetch('build/contracts/AstterLive.json')
        .then(response => response.json())
        .then(data => {
            astterliveabi = data.abi;
    });

    astterlive = new web3.eth.Contract(astterliveabi, contract_address);
    console.log(accounts);

    hasStream = await astterlive.methods.hasStream(accounts[0]).call({from: accounts[0]});
    console.log(hasStream);
}

startStream.addEventListener('click', async (e) => {
    e.preventDefault();
    if(hasStream) {
        var stream = await astterlive.methods.getStreamforUser().call({from: accounts[0]});
        window.open('/stream_page.html?id='+stream[1], "_self");
    }else{
        window.open('/upload_edit.html', "_self");
    }
})

load();