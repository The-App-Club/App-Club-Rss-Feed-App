const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://pudding.cool/rss.xml`;
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
        creator: item.creator || 'Created By Anyone',
        title: item.title,
        publicURL: item.link,
        description: item.contentSnippet,
        publishedAt: item.isoDate,
      };
    }),
    programTitle: feed.title,
    programImage: feed.image
      ? feed.image.url
      : `https://i0.wp.com/alistapart.com/wp-content/uploads/2019/03/ala-logo-big.png?w=960&ssl=1`,
    programDescription: feed.description,
  };
  console.log(JSON.stringify(prettyInfo));
})();
