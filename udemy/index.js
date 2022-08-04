// https://www.udemy.com/developers/affiliate/
// const rp = require('request-promise');
import dotenv from 'dotenv';
import { base64encode, base64decode } from 'nodejs-base64';
dotenv.config();
import fetch from 'node-fetch';

function getInfo() {
  return new Promise(async (resolve, reject) => {
    const token = base64encode(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    );
    try {
      const res = await fetch(
        'https://www.udemy.com/api-2.0/courses/?search=javascript+react&category=IT+%26+Software',
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'ja,en-US;q=0.9,en;q=0.8',
            authorization: `Basic ${token}`,
          },
          body: null,
          method: 'GET',
        }
      );
      console.log();
      resolve(await res.json());
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  const info = await getInfo();
  console.log(JSON.stringify(info));
})();
