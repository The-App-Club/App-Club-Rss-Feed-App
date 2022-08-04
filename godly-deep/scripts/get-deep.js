const rp = require('request-promise');
const baseURL = 'https://godly.website';
const {writeFileSync, readFileSync} = require('fs');
const mkdirp = require('mkdirp');
const {JSDOM} = require('jsdom');

const processDir = './process';
const dumpDir = './dump';

function download(url) {
  return new Promise((resolve, reject) => {
    rp(url)
      .then(async (html) => {
        resolve(html);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getFileName(url) {
  return decodeURIComponent(url.split(/\//).reverse()[0]);
}

function coolParse(html) {
  return new Promise(async (resolve, reject) => {
    const dom = new JSDOM(html);
    const resultInfoList = [
      ...dom.window.document
        .querySelector(`section .w-full .grid.gap-4:not(.sticky)`)
        .querySelectorAll(`article`),
    ]
      .map((dom) => {
        return {
          thumbnailURL: dom.querySelector(`.aspect-thumb img`)
            ? dom.querySelector(`.aspect-thumb img`).getAttribute('src')
            : dom.querySelector(`.aspect-thumb video`).getAttribute('src'),
          dom,
        };
      })
      .filter((itemInfo) => {
        return itemInfo.thumbnailURL.indexOf(`data`) === -1;
      })
      .map((itemInfo) => {
        const {dom, thumbnailURL} = {...itemInfo};
        return {
          thumbnailURL,
          publicURL: dom
            .querySelector(`a[rel="noopener nofollow"]`)
            .getAttribute('href'),
          siteURL: `${'https://godly.website'}${dom
            .querySelector(`a:not([rel="noopener nofollow"])`)
            .getAttribute('href')}`,
          title: dom.querySelector(
            `a:not([rel="noopener nofollow"]) span:nth-child(2)`
          ).textContent,
          before: dom.querySelector(
            `a:not([rel="noopener nofollow"]) span:nth-child(3)`
          ).textContent,
        };
      });
    resolve(JSON.stringify(resultInfoList));
  });
}

function getDetailPageLinkList(file) {
  const json = readFileSync(`${processDir}/index.json`, 'utf-8');
  return JSON.parse(json);
}

function getTopicLinkInfoList(topicGroupName) {
  const json = readFileSync(
    `${processDir}/${topicGroupName}/index.json`,
    'utf-8'
  );
  return JSON.parse(json);
}

(async () => {
  mkdirp(processDir);
  mkdirp(dumpDir);
  const detailPageLinkList = getDetailPageLinkList();
  for (let i = 0; i < detailPageLinkList.length; i++) {
    const detailPageLink = detailPageLinkList[i];
    const dirName = getFileName(detailPageLink);
    const topicLinkInfoList = getTopicLinkInfoList(dirName);
    for (let j = 0; j < topicLinkInfoList.length; j++) {
      const topicLinkInfo = topicLinkInfoList[j];
      const {postCount, topicGroupName, topicName, publicLink} = {
        ...topicLinkInfo,
      };

      const htmlData = await download(publicLink);
      const dumpData = await coolParse(htmlData);
      await mkdirp(`${processDir}/${topicGroupName}/${topicName}`);
      await writeFileSync(
        `${processDir}/${topicGroupName}/${topicName}/index.json`,
        dumpData
      );
      console.log(`[${topicGroupName}/${topicName}] process done`);
    }
  }
})();
