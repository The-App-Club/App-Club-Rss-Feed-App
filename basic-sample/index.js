import Parser from 'rss-parser';
const parser = new Parser();

(async () => {
  const feed = await parser.parseURL('https://tympanus.net/codrops/feed/');
  const resultInfoList = [];
  feed.items.slice(0, 2).forEach((item) => {
    resultInfoList.push({
      guid: item.guid,
      categories: item.categories,
      contentSnippet: item.contentSnippet,
      creator: item.creator,
      title: item.title,
      link: item.link,
      date: item.isoDate,
    });
  });
  console.log(resultInfoList);
})();
