const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
const rp = require('request-promise');

function getThumbnailURL(publicURL) {
  return new Promise((resolve, reject) => {
    try {
      rp(publicURL, { method: 'get' }, (error, response) => {
        if (error) {
          reject(error);
        }
        const dom = new JSDOM(response.body);
        const thumbnail = dom.window.document
          .querySelector(`#headerImage > img`)
          .getAttribute('src');
        resolve(thumbnail);
      });
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const feedURL = `https://webgl.souhonzan.org/rss/`;
  const parser = new Parser({
    customFields: {
      item: [['enclosure', { keepArray: true }]],
    },
  });
  const feed = await parser.parseURL(feedURL);
  const prettyInfo = {
    episodes: await Promise.all(
      feed.items.map(async (item) => {
        const thumbnailURL = await getThumbnailURL(item.link);
        const dom = new JSDOM(item['content:encoded']);
        return {
          creator: item.creator,
          title: item.title,
          publicURL: item.link,
          categories: item.categories
            ? item.categories.join(', ')
            : 'non-categoraized',
          description: item.contentSnippet,
          publishedAt: item.isoDate,
          thumbnail: dom.window.document.querySelector(`img`)
            ? dom.window.document.querySelector(`img`).getAttribute('src')
            : thumbnailURL,
        };
      })
    ),
    programTitle: feed.title,
    programImage: feed.image
      ? feed.image.url
      : `https://tympanus.net/codrops/wp-content/themes/codropstheme03/images/codrops-logo.svg`,
    programDescription: feed.description,
  };
  console.log(JSON.stringify(prettyInfo));
})();
