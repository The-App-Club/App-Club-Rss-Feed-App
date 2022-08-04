const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
(async () => {
  const feedURL = `https://www.freecodecamp.org/news/tag/graphql/rss/`;
  // const feedURL = `https://www.freecodecamp.org/news/tag/svelte/rss/`
  // const feedURL = `https://www.freecodecamp.org/news/tag/nextjs/rss/`
  // const feedURL = `https://www.freecodecamp.org/news/tag/design/rss/`
  // const feedURL = `https://www.freecodecamp.org/news/tag/tailwind/rss/`
  // const feedURL = `https://www.freecodecamp.org/news/tag/web-development/rss/`
  // const feedURL = `https://www.freecodecamp.org/news/tag/css/rss/`
  // const feedURL = `https://www.freecodecamp.org/news/tag/react/rss/`;
  // const feedURL = `https://www.freecodecamp.org/news/tag/javascript/rss/`;
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
        publicURL: item.link,
        description: item.contentSnippet,
        categories: item.categories
          ? item.categories.join(', ')
          : 'non-categoraized',
        publishedAt: item.isoDate,
        thumbnail: dom.window.document.querySelector(`img`)
          ? dom.window.document.querySelector(`img`).getAttribute('src')
          : 'https://media1.giphy.com/media/3TACspcXhhQPK/giphy.gif',
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
