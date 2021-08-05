const shows = {
    "Criminal Minds": "crm",
}

let timeTag = null;
let videoTag = null;
let timeCode = null;

document.getElementById("clickme").addEventListener("click", () => {
    updateData();
})

function formatTime(time) {
    time = time.replace(":", "")
    out = "000000"
    for (let i=0; i < time.length, i++;) {
        out[-(i+1)] = time[-(i+1)]
    }
    return out;
}

function generateHashtag(nm, time, seasonAndEp=false) {
    let hashtag = "";
    let name = "";
    
    if (nm in shows) {name = shows[nm];}
    else {
        name = (nm.replaceAll(" ", "").toLowerCase()).replaceAll(/[^a-zA-Z0-9]/g, "");
        if (isNaN(name[name.length-1]) === false) {
            //meaning it is a number
            name += "_";
        }
    }

    if (seasonAndEp !== false) {
        hashtag += "S"+name;
        sep = seasonAndEp.split(":");
        sep[0] = sep[0].replace("S", "");
        sep[1] = sep[1].replace("E", "e");
        hashtag += sep[0]+sep[1];
    }
    else {
        hashtag += "M"+name;
    }

    videoTag = hashtag;

    time = time.split(" ")[0];
    timeCode = time;
    time = time.split(":");
    time.reverse();
    let secs = 0;
    
    console.log(time)
    time[0] = Number(time[0]);
    time[1] = Number(time[1]);
    secs += time[0];
    secs += time[1]*60;

    if (time.length === 3) {
        time[2] = Number(time[2]);
        secs += (time[2] * 60) * 60;
    }
    let inc = secs/15;
    inc = Math.floor(inc);
    hashtag += "T"+inc

    console.log("#"+hashtag);
    timeTag = hashtag;
}

function updateData() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;
        if (activeTab.url.includes("netflix.com/watch")) {
            document.getElementById("main").classList.remove("hide")
            document.getElementById("noShow").classList.add("hide")
            chrome.tabs.sendRequest(activeTabId, {action: "getDOM"}, function(response) {
                if (response) {
                    console.log(response.name);

                    let time = response.time;
                    time = time.split(" ")[0];
                    document.getElementById("curTime").innerHTML = time;

                    if (response.type === "show") {
                        document.getElementById("showName").innerHTML = response.name[0];
                        document.getElementById("seEp").innerHTML = response.name[1].replace(":", " - ");
                        
                        generateHashtag(response.name[0], response.time, response.name[1]);
                    }
                    else {
                        document.getElementById("showName").innerHTML = response.name[0];
                        document.getElementById("seEp").innerHTML = "Movie";

                        generateHashtag(response.name[0], response.time);
                    }
                }
            });
        }
        else {
            //not netflix
            document.getElementById("main").classList.add("hide")
            document.getElementById("noShow").classList.remove("hide")
        }
    
     });
}

updateData();

chrome.storage.sync.get(['url'], function(items) {
    console.log('Settings retrieved on startup:', items);
    if(!("url" in items)) {
        chrome.storage.sync.set({'url': null}, function() {console.log('url null saved');});
    }
    else if (items.url !== null) {
        chrome.storage.sync.get(['url'], function(items) {console.log('url got:', items);});
        chrome.storage.sync.set({'url': null}, function() {console.log('url null saved - after got');});
    }
});

document.getElementById("sendComment").addEventListener("click", () => {
    chrome.storage.sync.set({'wait': true}, function() {console.log('Settings saved');});
    sendTweet();
})

document.getElementById("openTweets").addEventListener("click", () => {
    chrome.storage.sync.get(['wait'], function(items) {console.log('Settings retrieved', items);});
    viewTweets();
})

function sendTweet() {
    let textar = document.getElementById("commentContent");
    if (timeTag !== null && textar.value !== "" && videoTag !== null && timeCode !== null) {
        let url = "https://twitter.com/intent/tweet?hashtags=TIMETAG&hashtags=VIDEOTAG&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Eshare%7Ctwgr%5E&text=CONTENT&via=HANDLE";
        console.log(url);
        url = url.replace("TIMETAG", timeTag);
        url = url.replace("VIDEOTAG", videoTag);
        url = url.replace("HANDLE", "ReatixApp");
        url = url.replace("CONTENT", textar.value + ` --- At ${timeCode}`);
        console.log(url);

        chrome.windows.create({
            url: url,
            type: "popup"
    })
    }
}

function viewTweets() {
    if (timeTag !== null) {
        let url = "https://twitter.com/hashtag/HASHTAG";
        url = url.replace("HASHTAG", timeTag);

        chrome.windows.create({
            url: url,
            type: "popup"
        })
    }

}
