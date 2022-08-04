const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://greensock.com/rss/1-blogs.xml/`;
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
        creator: item.creator ? item.creator : `by anyone`,
        title: item.title,
        categories: item.categories ? item.categories : ["gsap"],
        publicURL: item.link,
        description:
          item.contentSnippet.length > 140
            ? item.contentSnippet.slice(0, 140).replaceAll('\n', '') + '...'
            : item.contentSnippet,
        publishedAt: item.isoDate,
        thumbnail: item.enclosure.url,
      };
    }),
    programTitle: feed.title,
    programImage: feed.image
      ? feed.image.url
      : `https://res.cloudinary.com/cpress/image/upload/v1602675575/hhmdxfk96fnbq3effjk1.png`,
    programDescription: feed.description,
  };
  console.log(JSON.stringify(prettyInfo));
})();
