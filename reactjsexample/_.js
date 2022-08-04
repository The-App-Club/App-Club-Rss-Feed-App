const { writeFileSync, rmdirSync } = require('fs');
const mkdirp = require('mkdirp');
const p = require('phin');
const { JSDOM } = require('jsdom');
const dumpDir = `feed`;
(async () => {
  await mkdirp(dumpDir);
  const res = await p('https://reactjsexample.com/');

  const htmlTextData = res.body.toString('utf-8');
  const dom = new JSDOM(htmlTextData);
  const itemInfoList = [
    ...dom.window.document
      .querySelector(`#navMenuIndex`)
      .querySelectorAll(`.navbar-dropdown`),
  ]
    .map((dom) => {
      return [...dom.querySelectorAll(`.navbar-item`)];
    })
    .flat()
    .map((dom) => {
      return {
        feedURL: `https://reactjsexample.com${dom.getAttribute('href')}rss`,
        tagName: dom.textContent,
      };
    });

  await writeFileSync(
    `${dumpDir}/index.json`,
    JSON.stringify(itemInfoList)
  );
})();
