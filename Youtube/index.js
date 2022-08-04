const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://www.youtube.com/feeds/videos.xml?channel_id=UC80PWRj_ZU8Zu0HSMNVwKWw`;
  const parser = new Parser({
    customFields: {
      item: [['enclosure', { keepArray: true }]],
    },
  });
  const feed = await parser.parseURL(feedURL);
  const prettyInfo = {
    episodes: feed.items.map((item, index) => {
      const dom = new JSDOM(item['content:encoded']);
      return {
        creator: item.author,
        title: item.title,
        publicURL: item.link,
        categories: item.categories
          ? item.categories.join(', ')
          : 'non-categoraized',
        description: item.contentSnippet,
        publishedAt: item.isoDate,
        thumbnail: dom.window.document.querySelector(`img`)
          ? dom.window.document.querySelector(`img`).getAttribute('src')
          : `https://picsum.photos/seed/${index}/300/300`,
      };
    }),
    programTitle: feed.title,
    programImage: feed.image
      ? feed.image.url
      : `https://picsum.photos/seed/${1}/300/300`,
    programDescription: feed.description,
  };
  console.log(JSON.stringify(prettyInfo));
})();
