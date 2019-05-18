const ffmpeg = require("fluent-ffmpeg");
const proc = new ffmpeg();
const urlRegex = require("url-regex");
const fetch = require("node-fetch");
const request = require('request');

const url = "https://www.reddit.com/r/BrawlStarsClips/comments/bpk3ak/id_like_to_nominate_my_teams_primo_for_best_play/";
const _res = [1080, 720, 480,'2_4_M','1_2_M];

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
    _res.forEach(res=>{
        request(`https://v.redd.it/${mediaId}/DASH_${res}`, (error, response, body) => {
            if(response.statusCode===200) {
                scrape(mediaId,res)
            }
        });
    })
}


function scrape(mediaId,res) {
    proc.addInput(`https://v.redd.it/${mediaId}/DASH_${res}`)
        .addInput(`https://v.redd.it/${mediaId}/audio`)
        .output()
        .on("progress", progress => {
            console.log(
                Math.round(progress.percent) + "%."
            );
        })
        .on("error", err => {
            console.log("Error: " + err);
        })
        .on("end", () => {
            console.log("Done");
        })
        .run();
}
