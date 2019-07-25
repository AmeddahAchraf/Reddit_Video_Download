const ffmpeg = require("fluent-ffmpeg");
const proc = new ffmpeg();
const urlRegex = require("url-regex");
const fetch = require("node-fetch");
var oneDownload = false;

if (process.argv.length <= 2) {
  console.log('Missing URL.');
  console.log('Usage: node index.js <reddit-url> [output-folder]');
  console.log('(the default output folder is ./');
  console.log('Example: node index.js https://www.reddit.com/r/ItHadToBeBrazil/comments/chjfh1/i_wonder_how_much_that_upgrade_costed/ ~/Videos');
  process.exit(0);
}

const url = process.argv[2];

var outputFolder = './';

if (process.argv.length >= 4) outputFolder = process.argv[3];

if (!outputFolder.endsWith('/')) outputFolder += '/';

const _res = [1080, 720, 480, 360, 240, 140, 120, '2_4_M', '1_2_M'];

console.log(`Output folder > ${outputFolder}`);
console.log(`URL > ${url}`);

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
  console.log('Hold on, Fetching the Best Quality');
  _res.forEach(res => {
    fetch(`https://v.redd.it/${mediaId}/DASH_${res}`)
      .then(response => {
        if (response.status === 200 && !oneDownload) {
          oneDownload = true;
          console.log('Downloading With : ' + res + ' Please Wait ...');
          scrape(mediaId, res);
        }
      });
  });
}


function scrape(mediaId, res) {
  proc.addInput(`https://v.redd.it/${mediaId}/DASH_${res}`)
    .output(`${outputFolder}${mediaId}-${res}.mp4`)
    .on("error", err => {
      console.log("Error: " + err);
    })
    .on("end", () => {
      console.log("Done");
    });

  fetch(`https://v.redd.it/${mediaId}/audio`)
    .then(resp => {
      if (resp.status === 200) {
        console.log('Founded audio track...')
        proc.addInput(`https://v.redd.it/${mediaId}/audio`);
      } else {
        console.log('No audio track...');
      }
      console.log('Downloading and converting...');
      proc.run();
    });
}
