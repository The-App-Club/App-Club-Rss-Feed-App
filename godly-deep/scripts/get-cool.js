const rp = require('request-promise');
const baseURL = 'https://godly.website';
const {writeFileSync, readFileSync} = require('fs');
const mkdirp = require('mkdirp');
const {JSDOM} = require('jsdom');

const processDir = './process';
const dumpDir = './dump';

function getFileName(url) {
  return decodeURIComponent(url.split(/\//).reverse()[0]);
}

function coolParse(url, dirName) {
  return new Promise(async (resolve, reject) => {
    const html = await readFileSync(
      `${dumpDir}/${dirName}/index.html`,
      'utf-8'
    );
    const dom = new JSDOM(html);
    resolve(
      JSON.stringify(
        [
          ...dom.window.document
            .querySelector(`.space-y-1`)
            .querySelectorAll(`.gap-4`),
        ].map((domGroup) => {
          let topicName = domGroup
            .querySelector(`:nth-child(2)`)
            .querySelector(`a`)
            .getAttribute(`href`);
          topicName = getFileName(topicName);
          return {
            postCount: domGroup.querySelector(`:nth-child(1)`).textContent,
            topicGroupName: dirName,
            topicName: topicName,
            publicLink: `${baseURL}/websites/${topicName}`,
          };
        })
      )
    );
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
    const dumpData = await coolParse(detailPageLink, dirName);
    await mkdirp(`${processDir}/${dirName}`);
    await writeFileSync(`${processDir}/${dirName}/index.json`, dumpData);
    console.log(`[${dirName}] process done`);
  }
})();
