import React from 'react';
import Episode from './Episode';

const EpisodeList = ({
  programTitle,
  programDescription,
  programImage,
  episodes,
}) => {
  return (
    <div>
      {episodes ? (
        <div>
          {episodes.map((episode, i) => (
            <Episode
              key={Math.random() * i}
              index={i}
              title={episode.title}
              enclosure={episode.enclosure}
              link={
                episode.enclosure
                  ? episode.enclosure.url
                  : 'json_data is null or undefined'
              }
              image={programImage}
              description={episode.description}
            />
          ))}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

export { EpisodeList };
