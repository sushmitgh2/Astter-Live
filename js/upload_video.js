var astterlive, astterliveabi;
const contract_address = "0x11C8Fa38a4302a476088d95b51918A341b19C2c6";
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

    await fetch('../build/contracts/AstterLive.json')
        .then(response => response.json())
        .then(data => {
            astterliveabi = data.abi;
    });

    astterlive = new web3.eth.Contract(astterliveabi, contract_address);
    console.log(accounts);

    hasStream = await astterlive.methods.hasStream(accounts[0]).call({from: accounts[0]});
    console.log(hasStream);

    if(await hasStream){
        alert("You already have a stream created. Start a stream instead?");
    }
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