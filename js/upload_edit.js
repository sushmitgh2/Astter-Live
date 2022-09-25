var connectBtn = document.getElementById('connect');
var video_title = document.getElementById('video-title');
var save = document.getElementById('save');

var astterlive, astterliveabi;
const contract_address = "0x795A5291643354a371FCeb5ae770c2A821920839";
var accounts;
var img;

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
}

async function previewImage() {
    img = uploadInput.files;
    if(img.length > 0) {
        var fileReader = new FileReader();

        fileReader.onload = function (event) {
            document.getElementById('preview').setAttribute("src", event.target.result);
        }

        fileReader.readAsDataURL(img[0]);
    }
}

load();

save.addEventListener('click', async () => {
    //console.log(video_title.value);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 81b64de2-c0ef-4d95-a066-6dacbaf6f427',
    }

    const data = {
        "name": video_title.value,
        "profiles": [
          {
            "name": "720p",
            "bitrate": 2000000,
            "fps": 30,
            "width": 1280,
            "height": 720
          },
          {
            "name": "480p",
            "bitrate": 1000000,
            "fps": 30,
            "width": 854,
            "height": 480
          },
          {
            "name": "360p",
            "bitrate": 500000,
            "fps": 30,
            "width": 640,
            "height": 360
          }
        ]
    }

    axios.post('https://livepeer.studio/api/stream', data, {
        headers: headers,
    }).then(async (response) => {
        var res = response.data;
        console.log(res);

        var streamData = [res['name'], res['id'], document.getElementById('desc').value];
        var profiles = res['profiles'];
        var profileData = [[profiles[0].name, profiles[0].bitrate+"", profiles[0].fps+"", profiles[0].width+"", profiles[0].height+""], [profiles[1].name, profiles[1].bitrate+"", profiles[1].fps+"", profiles[1].width+"", profiles[1].height+""], [profiles[2].name, profiles[2].bitrate+"", profiles[2].fps+"", profiles[2].width+"", profiles[2].height+""]]
        
        axios({
            method: 'post',
            url: 'https://api.nft.storage/upload',
            data: img[0],
            headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEQ4ZWY0RGY5ZDhFNjY1MWEwNTFBMzQxYjRGNDMzM0ZERWRmNjIyOTAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1ODAzMDAxMjIyNSwibmFtZSI6IkVhcnRoUmFpc2VyIn0.go2tdDF2TJ4Se7qrD3vasa8mgjVRqlvIWRbUBEkvQS4' }
            })
            .then(async function (response) {
                //handle success
                currentCID = response.data.value.cid;
                console.log(currentCID);
                alert("Your token has been added to IPFS. CID: "+currentCID);

                streamData = [...streamData, currentCID];
                const fnData = await astterlive.methods.createStream(streamData, document.getElementById('select').value, profileData).encodeABI();

                web3.eth.sendTransaction({
                    from: accounts[0],
                    to: contract_address,
                    data: fnData,
                })
                .on('transactionHash', function(hash){
                    console.log(hash);
                })
                .on('receipt', function(receipt){
                    console.log(receipt);
                    window.open('/stream_page.html?id='+res['id'], "_self");
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                })
                .on('error', console.error);
            })
            .catch(function (response) {
                console.log(response);
            });

    });

})
