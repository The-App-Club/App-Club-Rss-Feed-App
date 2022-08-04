const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  // あやしい
  const feedURL = `https://www.sitepoint.com/feed/`;
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
            ? item.contentSnippet.slice(0, 140).replaceAll('\n', '') + '...'
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
      : `https://media1.giphy.com/media/3TACspcXhhQPK/giphy.gif`,
    programDescription: feed.description,
  };
  console.log(JSON.stringify(prettyInfo));
})();
