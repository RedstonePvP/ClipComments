chrome.extension.onRequest.addListener(function(request, sender, sendResponse) { 
    try {
        let nameT = document.getElementsByClassName("ellipsize-text")[0];   
        if (nameT.nodeName == "H4") {
            sendResponse({
                success: true,
                type: "movie",
                time: document.getElementsByClassName("scrubber-head")[0].ariaValueText,
                name: [nameT.innerHTML]
            }); 
        }
        else {
            sendResponse({
                success: true,
                type: "show",
                time: document.getElementsByClassName("scrubber-head")[0].ariaValueText,
                name: [nameT.children[0].innerHTML, nameT.children[1].innerHTML, nameT.children[2].innerHTML]
            }); 
        }  
    } catch (error) {
        sendResponse({
            success: false
        })
    }
   });
