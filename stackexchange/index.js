const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://stackexchange.com/feeds/questions`;
  const parser = new Parser({
    customFields: {
      item: [['enclosure', { keepArray: true }]],
    },
  });
  const feed = await parser.parseURL(feedURL);
  const prettyInfo = {
    episodes: feed.items.map((item) => {
      return {
        creator: item.creator,
        title: item.title,
        publicURL: item.link,
        description: item.summary.replace(/\r\n/g, "").trim(),
        publishedAt: item.isoDate,
        thumbnail: 'https://media1.giphy.com/media/3TACspcXhhQPK/giphy.gif',
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
