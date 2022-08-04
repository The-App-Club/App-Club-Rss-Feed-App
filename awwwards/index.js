const { writeFileSync } = require("fs");
const mkdirp = require("mkdirp");
const { chromium } = require("playwright");

const processDir = "./process";

function getFileName(url) {
  return url.split(/\//).reverse()[0];
}

function getAwwwardsDetail(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url);
      await page.waitForLoadState("load");
      const scoreList = await page.evaluate(() => {
        return [
          ...document.querySelectorAll(".box-notesite.js-notes > ul > li"),
        ].map((dom) => {
          return dom.getAttribute("data-note");
        });
      });
      const scoreInfo = scoreList.reduce((resultInfo, item, currentIndex) => {
        if (currentIndex === 0) {
          resultInfo = Object.assign(resultInfo, {
            design: Number(item),
          });
        }
        if (currentIndex === 1) {
          resultInfo = Object.assign(resultInfo, {
            usability: Number(item),
          });
        }
        if (currentIndex === 2) {
          resultInfo = Object.assign(resultInfo, {
            creativity: Number(item),
          });
        }
        if (currentIndex === 3) {
          resultInfo = Object.assign(resultInfo, {
            content: Number(item),
          });
        }
        if (currentIndex === 4) {
          resultInfo = Object.assign(resultInfo, {
            mobile: Number(item),
          });
        }
        if (currentIndex === 5) {
          resultInfo = Object.assign(resultInfo, {
            developer: Number(item),
          });
        }
        return resultInfo;
      }, {});

      // https://assets.awwwards.com/awards/submissions/2021/10/6172d294e146f137644193.jpg

      const thumbnailURL = await page.evaluate(() => {
        return document.querySelector(`a[data-type="submission"] > img`).src;
      });

      const title = await page.evaluate(() => {
        return document.querySelector(".heading-large > a").textContent;
      });

      const webURL = await page.evaluate(() => {
        return document.querySelector(".heading-large > a").href;
      });

      const misc = await page.evaluate(() => {
        return JSON.parse(
          document.querySelector(".box-breadcrumb").dataset.model
        );
      });

      Object.assign(scoreInfo, { thumbnailURL });
      Object.assign(scoreInfo, { title });
      Object.assign(scoreInfo, { webURL });
      Object.assign(scoreInfo, { misc });
      Object.assign(scoreInfo.misc, {
        images: {
          thumbnail: `https://assets.awwwards.com/awards/${scoreInfo.misc.images.thumbnail}`,
        },
      });

      await browser.close();
      resolve(scoreInfo);
    } catch (error) {
      reject(error);
    }
  });
}

function getAwwwardsDetailLinkList() {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(
        "https://www.awwwards.com/websites/?award=sites_of_the_day&category=architecture"
      );
      await page.waitForLoadState("load");
      const detailPageLinkList = await page.evaluate(() => {
        return [
          ...document.querySelectorAll(
            `.list-items.list-flex.js-elements-container > li`
          ),
        ].map((dom) => {
          return dom.querySelector(`a`).href;
        });
      });

      await browser.close();
      resolve(detailPageLinkList);
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  await mkdirp(processDir);
  const detailPageLinkList = await getAwwwardsDetailLinkList();
  const resultInfoList = [];
  for (let index = 0; index < detailPageLinkList.length; index++) {
    const detailPageLink = detailPageLinkList[index];
    const fileName = getFileName(detailPageLink);
    const votesContent = await getAwwwardsDetail(`${detailPageLink}`);
    resultInfoList.push(votesContent);
    console.log(`[${fileName}] process done`);
  }
  await writeFileSync(
    `${processDir}/index.json`,
    JSON.stringify(resultInfoList)
  );
})();
