import React, { useState, useEffect, useRef } from 'react';
import Parser from 'rss-parser';
import styled from '@emotion/styled';

import './index.css';
import { EpisodeList } from './components/EpisodeList';
import { LoadingStatus } from './components/LoadingStatus';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App = ({ fetching }) => {
  const inputRef = useRef(null);
  const [feedURL, setFeedURL] = useState('https://feeds.megaphone.fm/replyall');
  const [fetched, setFetched] = useState({});
  const [onFetching, setOnFetching] = useState(false);
  const [previousFeeds, setPreviousFeeds] = useState([]);
  const [error, setError] = useState(false);

  const _Controller = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 800px) {
      width: 80vw;
      height: 3rem;
      margin: 10px auto;
    }
    @media screen and (min-width: 799px) {
      width: 70vw;
      height: 3rem;
      margin: 30px auto;
    }
  `;

  const _Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    height: inherit;
    width: 20%;
    font-size: 1.2rem;
  `;

  const _InputText = styled.input`
    display: block;
    height: inherit;
    width: 80%;
    line-height: 1.5;
  `;

  const handleChangeFeedURL = (event) => {
    setFeedURL(event.target.value);
  };

  const query = async (parser) => {
    if (feedURL) {
      try {
        const feed = await parser.parseURL(feedURL);

        setOnFetching((prev) => {
          return !prev;
        });

        setFetched({
          episodes: feed.items,
          programTitle: feed.title,
          programImage: feed.image.url,
          programDescription: feed.description,
        });

        setTimeout(() => {
          setOnFetching((prev) => {
            return !prev;
          });
        }, 2200);

        setPreviousFeeds([...new Set([...previousFeeds, feedURL])]);

        return setError(false);
      } catch (error) {
        setOnFetching(false);
        setError(true);

        console.log(error);
      }
    } else {
      return;
    }
  };

  const getFeed = (event) => {
    const parser = new Parser({
      customFields: {
        item: [['enclosure', { keepArray: true }]],
      },
    });

    (async () => {
      await query(parser);
    })();
  };

  return (
    <div className="App">
      <Header></Header>

      <_Controller>
        <_InputText
          value={feedURL}
          type="text"
          onChange={(e) => {
            handleChangeFeedURL(e);
          }}
        ></_InputText>

        <_Button
          onClick={(e) => {
            getFeed(e);
          }}
        >
          fetch
        </_Button>
      </_Controller>
      {error ? <p>Something Went Wrong...</p> : <div></div>}

      <LoadingStatus fetching={onFetching}></LoadingStatus>

      <EpisodeList
        episodes={fetched.episodes}
        programTitle={fetched.programTitle}
        programDescription={fetched.programDescription}
        programImage={fetched.programImage}
        fetching={onFetching}
      />

      <Footer></Footer>
    </div>
  );
};

export default App;
