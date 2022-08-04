const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://dev.to/rss`;
  const parser = new Parser({
    customFields: {
      item: [['enclosure', { keepArray: true }]],
    },
  });
  const feed = await parser.parseURL(feedURL);
  const prettyInfo = {
    episodes: feed.items.map((item) => {
      const dom = new JSDOM(item['content:encoded']);
      return {
        creator: item.creator,
        title: item.title,
        publicURL: item.guid,
        description:
          item.contentSnippet.length > 140
            ? item.contentSnippet.slice(0, 140) + '...'
            : item.contentSnippet,
        publishedAt: item.isoDate,
        thumbnail: dom.window.document.querySelector(`img`)
          ? dom.window.document.querySelector(`img`).getAttribute('src')
          : 'https://media1.giphy.com/media/3TACspcXhhQPK/giphy.gif',
      };
    }),
    programTitle: feed.title,
    programImage: feed.image
      ? feed.image.url
      : `https://res.cloudinary.com/practicaldev/image/fetch/s--pVCMYZWJ--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_350/https://scontent-lga3-1.cdninstagram.com/vp/7c898e2c9e9fa71f72dd5d422d444549/5DFE1BFA/t51.2885-15/fr/e15/s1080x1080/57390242_386431405416711_440644832181536446_n.jpg%3F_nc_ht%3Dscontent-lga3-1.cdninstagram.com`,
    programDescription: feed.description,
  };
  console.log(JSON.stringify(prettyInfo));
})();
