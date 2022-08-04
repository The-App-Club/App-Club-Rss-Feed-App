const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://tympanus.net/codrops/tag/locomotive-scroll/feed/`;
  // const feedURL = `https://tympanus.net/codrops/feed/`;
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
        categories: item.categories
          ? item.categories.join(', ')
          : 'non-categoraized',
        description: item.contentSnippet,
        publishedAt: item.isoDate,
        thumbnail: dom.window.document.querySelector(`img`)
          ? dom.window.document.querySelector(`img`).getAttribute('src')
          : 'https://media1.giphy.com/media/3TACspcXhhQPK/giphy.gif',
      };
    }),
    programTitle: feed.title,
    programImage: feed.image
      ? feed.image.url
      : `https://tympanus.net/codrops/wp-content/themes/codropstheme03/images/codrops-logo.svg`,
    programDescription: feed.description,
  };
  console.log(JSON.stringify(prettyInfo));
})();
