const rp = require('request-promise');
const {writeFileSync, rmdirSync, readFileSync} = require('fs');
const mkdirp = require('mkdirp');
const {JSDOM} = require('jsdom');

const dumpDir = './dump';
const processDir = './process';

function download(url) {
  return new Promise((resolve, reject) => {
    rp(url)
      .then((html) => {
        writeFileSync(`${dumpDir}/index.html`, html);
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getDetailPageLinkList(file) {
  const html = readFileSync(`${dumpDir}/index.html`, 'utf-8');
  const dom = new JSDOM(html);
  return [...dom.window.document.querySelectorAll(`a`)]
    .filter((dom) => {
      return dom.textContent === 'More';
    })
    .map((dom) => {
      return `https://godly.website${dom.getAttribute('href')}`;
    });
}

(async () => {
  mkdirp(processDir);
  mkdirp(dumpDir);
  const url = 'https://godly.website/directory';
  await download(url);
  const detailPageLinkList = getDetailPageLinkList();
  const resultInfoList = detailPageLinkList;
  writeFileSync(`${processDir}/index.json`, JSON.stringify(resultInfoList));
})();
