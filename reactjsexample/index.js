const Parser = require('rss-parser');
const { JSDOM } = require('jsdom');
const { readFileSync } = require('fs');

(async () => {
  const feedInfoList = JSON.parse(readFileSync('./feed/index.json', 'utf-8'));

  let resultInfoList = [];

  for (let index = 0; index < feedInfoList.length; index++) {
    const feedInfo = feedInfoList[index];
    const { feedURL, tagName } = { ...feedInfo };
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
          title: item.title,
          publicURL: item.link,
          categories: item.categories
          ? item.categories.join(', ')
          : 'non-categoraized',
          description:
            item.contentSnippet.replace(/\n/g, '').slice(0, 140) + '...',
          thumbnail: dom.window.document.querySelector(`img`)
          ? dom.window.document.querySelector(`img`).getAttribute('src')
          : 'https://media1.giphy.com/media/3TACspcXhhQPK/giphy.gif',
          tagName,
        };
      }),
      programTitle: feed.title,
      programImage: feed.image
        ? feed.image.url
        : `https://dzdih2euft5nz.cloudfront.net/profiles/headers/118066.png?1630374691`,
      programDescription: feed.description,
    };

    resultInfoList = resultInfoList.concat(...prettyInfo.episodes);
  }
  console.log(JSON.stringify(resultInfoList));
})();
