const request = require('request');

function getStremId(accessToken) {
  return new Promise((resolve, reject) => {
    request(
      'https://www.inoreader.com/reader/api/0/preference/stream/list',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
      },
      function (error, response, body) {
        if (error) {
          reject(error);
          console.log(error);
        }

        resolve(
          JSON.parse(body).streamprefs['user/1004786906/state/com.google/root']
        );
      }
    );
  });
}

function getStremContent(accessToken, stremId) {
  return new Promise((resolve, reject) => {
    request(
      `https://www.inoreader.com/reader/api/0/stream/contents/${stremId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'GET',
      },
      function (error, response, body) {
        if (error) {
          reject(error);
          console.log(error);
        }

        resolve(
          JSON.parse(body).items.map((item) => {
            return {
              title: item.title,
              published: item.published,
              publicURL: item.canonical[0].href,
              description: item.summary.content,
            };
          })
        );
      }
    );
  });
}

//

function getRefreshToken() {
  return new Promise((resolve, reject) => {
    // get refresh token...
    request(
      'https://www.inoreader.com/oauth2/token',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencode',
        },
        method: 'POST',
        form: 'code=xxx&redirect_uri=https://example.com/&client_id=xxx&client_secret=xxx&scope=&grant_type=refresh_token&refresh_token=xxx',
      },
      function (error, response, body) {
        if (error) {
          reject(error);
          console.log(error);
        }

        resolve(JSON.parse(body));
      }
    );
  });
}

(async () => {
  const refreshTokenInfo = await getRefreshToken();
  const stremIdInfoList = await getStremId(refreshTokenInfo.access_token);
  const resultInfoList = [];
  for (let index = 0; index < stremIdInfoList.length; index++) {
    const stremIdInfo = stremIdInfoList[index];
    const { id, value } = { ...stremIdInfo };
    resultInfoList.push({
      streamId: value,
      itemInfoList: await getStremContent(refreshTokenInfo.access_token, id),
    });
  }
  // console.log(resultInfoList);
  console.log(JSON.stringify(resultInfoList));
})();
