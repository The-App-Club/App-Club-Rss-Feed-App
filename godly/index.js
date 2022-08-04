const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://godly.website/feed.xml`;
  const parser = new Parser({
    customFields: {
      item: [['enclosure', { keepArray: true }]],
    },
  });
  const feed = await parser.parseURL(feedURL);
  const prettyInfo = {
    episodes: feed.items.map((item) => {
      const dom = new JSDOM(item['content']);
      return {
        creator: item.creator,
        title: item.title,
        categories: item.categories
          ? item.categories.join(', ')
          : 'non-categoraized',
        publicURL: item.link,
        description: item.contentSnippet
          ? item.contentSnippet.slice(0, 140) + '...'
          : 'nothing description',
        publishedAt: item.isoDate,
        thumbnail: item.enclosure.url,
      };
    }),
    programTitle: feed.title,
    programImage: feed.image
      ? feed.image.url
      : `https://media1.giphy.com/media/3TACspcXhhQPK/giphy.gif`,
    programDescription: feed.description.replace(/\n\s+/g, ''),
  };
  console.log(JSON.stringify(prettyInfo));
})();
