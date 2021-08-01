console.log("LOADED!");

chrome.storage.sync.get(['wait'], function(items) {
    console.log('Settings retrieved', items);
    if (items.wait == true) {
        chrome.storage.sync.set({'wait': false}, function() {console.log('Settings saved');});
        let url = "";

        var checkExist = setInterval(function() {
            let sel = document.querySelector("#layers > div:nth-child(2) > div > div > div > div > div.css-1dbjc4n.r-18u37iz > a");
            if (sel !== null) {
                console.log("Exists!");
                url = sel.href;
                console.log(url);
                chrome.storage.sync.set({'url': url}, function() {console.log('Settings saved');});
                //make attemt to send url to server
                //if done with post then set url to null otherwise it will post data on extension startup
            clearInterval(checkExist);
            }
        }, 100); // check every 100ms
    }
});
