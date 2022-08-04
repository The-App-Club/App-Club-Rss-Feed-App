const rp = require('request-promise');
const { JSDOM } = require('jsdom');

function getDumpPage(publicURL) {
  return new Promise((resolve, reject) => {
    try {
      rp(publicURL, { method: 'get' }, (error, response) => {
        if (error) {
          reject(error);
        }
        resolve(new JSDOM(response.body));
      });
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const dom = await getDumpPage('https://tympanus.net/codrops/tags-archive/');

  const tagList = [
    ...dom.window.document
      .querySelector(`.ct-page-content.ct-tags-archive`)
      .querySelectorAll(`a`),
  ].map((dom) => {
    return dom.getAttribute('href');
  });
  console.log(JSON.stringify(tagList));
})();
