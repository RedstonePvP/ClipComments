console.log("LOADED!");
let url = "";

var checkExist = setInterval(function() {
    let sel = document.querySelector("#layers > div:nth-child(2) > div > div > div > div > div.css-1dbjc4n.r-18u37iz > a");
    if (sel !== null) {
        console.log("Exists!");
        url = sel.href;
        console.log(url);
       clearInterval(checkExist);
    }
 }, 100); // check every 100ms