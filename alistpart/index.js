const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://alistapart.com/main/feed/`;
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
        creator: item.creator.replace(/\t/g, '').replace(/\n/g, '') + `AnyOne`,
        title: item.title.replace(/\t/g, '').replace(/\n/g, ''),
        publicURL: item.guid.replace(/\t/g, '').replace(/\n/g, ''),
        description:
          item.contentSnippet.length > 140
            ? item.contentSnippet.slice(0, 140) + '...'
            : item.contentSnippet,
        publishedAt: item.isoDate.replace(/\t/g, '').replace(/\n/g, ''),
        thumbnail: dom.window.document.querySelector(`img`)
          ? dom.window.document.querySelector(`img`).getAttribute('src')
          : 'https://media1.giphy.com/media/3TACspcXhhQPK/giphy.gif',
      };
    }),
    programTitle: feed.title.replace(/\t/g, '').replace(/\n/g, ''),
    programImage: feed.image
      ? feed.image.url
      : `https://i0.wp.com/alistapart.com/wp-content/uploads/2019/03/ala-logo-big.png?w=960&ssl=1`,
    programDescription: feed.description.replace(/\t/g, '').replace(/\n/g, ''),
  };
  console.log(JSON.stringify(prettyInfo));
})();
