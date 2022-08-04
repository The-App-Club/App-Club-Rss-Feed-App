const rp = require('request-promise');
const {writeFileSync, readFileSync} = require('fs');
const mkdirp = require('mkdirp');
const {JSDOM} = require('jsdom');

const processDir = './process';
const dumpDir = './dump';

function getFileName(url) {
  return decodeURIComponent(url.split(/\//).reverse()[0]);
}

function download(url, dirName) {
  return new Promise((resolve, reject) => {
    rp(url)
      .then(async (html) => {
        await mkdirp(`${dumpDir}/${dirName}`);
        await writeFileSync(`${dumpDir}/${dirName}/index.html`, html);
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getDetailPageLinkList(file) {
  const json = readFileSync(`${processDir}/index.json`, 'utf-8');
  return JSON.parse(json);
}

(async () => {
  mkdirp(processDir);
  mkdirp(dumpDir);
  const detailPageLinkList = getDetailPageLinkList();

  for (let i = 0; i < detailPageLinkList.length; i++) {
    const detailPageLink = detailPageLinkList[i];
    const dirName = getFileName(detailPageLink);
    await download(detailPageLink, dirName);
    console.log(`[${dirName}] process done`);
  }
})();
