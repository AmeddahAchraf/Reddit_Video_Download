const ffmpeg = require("fluent-ffmpeg");
const proc = new ffmpeg();
const urlRegex = require("url-regex");
const fetch = require("node-fetch");
var oneDownload = false ;
//Change the URL Below
const url = "https://www.reddit.com/r/BrawlStarsClips/comments/bpk3ak/id_like_to_nominate_my_teams_primo_for_best_play/";
const _res = [1080, 720, 480,'2_4_M','1_2_M'];

fetch(url)
    .then(res => {
        return res.text();
    })
    .then(body => {
        const urls = body.match(urlRegex());
        const mediaUrls = urls.filter(url => url.includes("v.redd.it"));
        let mediaUrl = mediaUrls[0].split("https://v.redd.it/")[1];
        mediaId = mediaUrl.split("/")[0];
        testUrls(mediaId);

    });

function testUrls(mediaId) {
    console.log('Hold on, Fetching the Best Quality')
    _res.forEach(res=>{
        fetch(`https://v.redd.it/${mediaId}/DASH_${res}`)
        .then(response =>{
           if(response.status===200 && !oneDownload) {
                oneDownload  = true ;
                console.log('Downloading With : '+res +' Please Wait ...');
                scrape(mediaId,res)

                // TODO : Break From The Promise Then The For Loop
                // Recursion 
            }
        })
    })
}


function scrape(mediaId,res) {
    proc.addInput(`https://v.redd.it/${mediaId}/DASH_${res}`)
        .addInput(`https://v.redd.it/${mediaId}/audio`)
        .output(`./${mediaId}-${res}.mp4`)
        .on("error", err => {
            console.log("Error: " + err);
        })
        .on("end", () => {
            console.log("Done");
        })
        .run();
}
