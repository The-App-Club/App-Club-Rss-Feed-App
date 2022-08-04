- Stack
  - [phin](https://github.com/ethanent/phin)

タグ一覧

```js
[
  ...document
    .querySelector(`#navMenuIndex`)
    .querySelectorAll(`.navbar-dropdown`),
]
  .map((dom) => {
    return [...dom.querySelectorAll(`.navbar-item`)];
  })
  .flat()
  .map((dom) => {
    return {
      feedURL: `https://reactjsexample.com${dom.getAttribute('href')}rss`,
      tagName: dom.textContent,
    };
  });
```
