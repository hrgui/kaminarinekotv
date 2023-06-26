// eslint
import {
  ContentAudioType,
  ContentFeed,
  ContentGroup,
  ContentItem,
  ContentSubtitleType,
  ID,
} from "../global";
import { sampleSize } from "lodash-es";
import { faker } from "@faker-js/faker";
import { promises as fs } from "fs";
import * as url from "url";
import * as path from "path";

/* eslint-disable */
//@ts-ignore - for some reason TS Node does not like not having the prefix
import { GENRES } from "../constants.ts";
/* eslint-enable */

const possibleGenres = GENRES;

const possibleCatVideos = [
  ["https://www.youtube.com/watch?v=HrCy2EXwF34", 40],
  ["https://www.youtube.com/watch?v=I8Z0frbryYg", 42],
  ["https://www.youtube.com/watch?v=avUE3RFh-nY", 6],
  ["https://www.youtube.com/watch?v=n_-kAq7gO1s", 21],
  ["https://www.youtube.com/watch?v=edgBlTHq7RI", 27],
  ["https://www.youtube.com/watch?v=YorcAjNv3dM", 9],
  ["https://www.youtube.com/watch?v=vuqA4uQlIQA", 26],
  ["https://www.youtube.com/watch?v=eCUIZ02mOuY", 19],
  ["https://www.youtube.com/watch?v=N2pDxflyGU4", 15],
  ["https://www.youtube.com/watch?v=GaL1vUm2zCk", 29],
  ["https://www.youtube.com/watch?v=OHOU2cNx9Qc", 28],
];

const possibleCatMovies = [
  ["https://www.youtube.com/watch?v=cbtU7CbJqdo", toSeconds(0, 4, 20)],
  ["https://www.youtube.com/watch?v=dIwwLGZJIHU", toSeconds(0, 2, 18)],
  ["https://www.youtube.com/watch?v=rtwy-xShpf0", toSeconds(0, 2, 11)],
  ["https://www.youtube.com/watch?v=fssdXg6uSps", toSeconds(0, 2, 2)],
  ["https://www.youtube.com/watch?v=Ah_TCvj9Wbc", toSeconds(0, 3, 10)],
  ["https://www.youtube.com/watch?v=9cMrZekp8Bo", toSeconds(0, 2, 23)],
  ["https://www.youtube.com/watch?v=bXvbNPKBFWk", toSeconds(0, 2, 48)],
];

const audioTypes: { [name: string]: ContentAudioType } = {
  japanese: {
    id: 1,
    name: "Japanese",
  },
  english: {
    id: 2,
    name: "English",
  },
  meow: {
    id: 3,
    name: "Meow talk",
  },
};

const subtitleTypes: { [name: string]: ContentSubtitleType } = {
  english: {
    id: 1,
    name: "English",
  },
  englishClosedCaptioned: {
    id: 2,
    name: "English - Closed Captioned",
    audioTypeId: 2,
  },
  japanese: {
    id: 3,
    name: "Japanese - Closed Captioned",
    audioTypeId: 1,
  },
};

const contentGroups: Partial<ContentGroup>[] = [
  {
    id: 1,
    title: "Rent-A-Neko",
    description: "Rent a cat for a day to adore in its cuteness",
    type: "series",
    genres: ["romance", "comedy", "harem"],
    originalAudioType: audioTypes.japanese,
    subtitles: [subtitleTypes.english],
  },
  {
    id: 2,
    title: "Full-Cat Alchemist",
    description: "A cat doing alchemy... saving the world.",
    type: "series",
    genres: ["action"],
    originalAudioType: audioTypes.japanese,
    subtitles: [subtitleTypes.english],
  },
  {
    id: 3,
    title: "My Cat Academia",
    description: "Superhero cats going to school.",
    type: "series",
    genres: ["action"],
    originalAudioType: audioTypes.japanese,
    subtitles: [subtitleTypes.english],
  },
];

const contentFeeds: Partial<ContentFeed>[] = [
  {
    id: 1,
    title: "Hero",
    type: "hero",
    description: "Our biggest hit!",
    items: [contentGroups[0] as ContentGroup],
  },
  {
    id: 2,
    title: "Top Picks for You",
    type: "carousel",
    description: "Try recommending one of these to your friends.",
  },
  {
    id: 3,
    title: "Continue Watching",
    type: "continue-watching",
    description: "Pick up where you left off",
  },
  {
    id: 4,
    title: "Watch Over the Weekend",
    type: "carousel",
    description: "These cat videos are sure to make your weekend relaxing!",
  },
  {
    id: 5,
    title: "Most Popular",
    type: "carousel",
    description: "The most cutest cat videos we have!",
  },
  {
    id: 6,
    title: "Just Updated",
    type: "carousel",
    description: "The latest and greatest cat videos.",
  },
  {
    id: 7,
    title: "Because you watched Rent-A-Neko",
    type: "carousel",
    description: "How about you try this?",
  },
];

function toSeconds(hours: number, mins: number, seconds: number) {
  return hours * 3600 + mins * 60 + seconds;
}

function chooseRandomFromArray(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getSeasonNumber(
  episodeNumber: number,
  howManyEpisodesPerSeason: number
) {
  let seasonNumber = 1;

  while (episodeNumber > howManyEpisodesPerSeason) {
    seasonNumber = seasonNumber + 1;
    episodeNumber = episodeNumber - howManyEpisodesPerSeason;
  }

  return seasonNumber;
}

function getRandomCatImage(
  width: number,
  height: number,
  overrideImageId?: number
): [string, number] {
  const imageId = overrideImageId || Math.ceil(Math.random() * 16);
  return [
    `https://placekitten.com/${width}/${height}?image=${imageId}`,
    imageId,
  ];
}

function generateRandomDescription() {
  const paragraph = faker.lorem.paragraph(3);
  const words = [
    "nyan",
    "meow",
    "nyaa",
    "mix",
    "meoooww",
    "kitty",
    "neko",
    "cat",
  ];

  // for every word that exists we're going to replace it with a random cat word
  return paragraph
    .split(" ")
    .map((word) => {
      return `${chooseRandomFromArray(words)}${word.endsWith(".") ? "." : ""}`;
    })
    .join(" ");
}

function generateContentEpisode(
  episodeNumber: number,
  howManyEpisodesPerSeason: number
): ContentItem {
  const [url, totalDuration] = chooseRandomFromArray(possibleCatVideos);
  return {
    id: faker.datatype.uuid(),
    title: `Episode ${episodeNumber}`,
    itemNumber: episodeNumber,
    description: generateRandomDescription(),
    seasonNumber: getSeasonNumber(episodeNumber, howManyEpisodesPerSeason),
    image: getRandomCatImage(240, 135)[0],
    source: {
      source: "youtube",
      metadata: {
        url,
        totalDuration,
      },
    },
  };
}

function getRandomCatTitle() {
  const possibleWaysForCat = ["Cat", "Neko"];
  const followUpWords = [
    "nyan",
    "meow",
    "nyaa",
    "mix",
    "meoooww",
    "kitty",
    "neko",
    "cat",
  ];

  const title =
    chooseRandomFromArray(possibleWaysForCat) +
    " " +
    chooseRandomFromArray(followUpWords) +
    " " +
    chooseRandomFromArray(followUpWords);
  return title;
}

function generateContentGroup(
  id: ID,
  overrides: Partial<ContentGroup> = {}
): ContentGroup {
  const title = getRandomCatTitle();
  const description = generateRandomDescription();
  const type: "series" | "movie" =
    overrides.type || chooseRandomFromArray(["series", "movie"]);
  const originalAudioType = audioTypes.japanese;
  const additionalContentAudioTypes = chooseRandomFromArray([
    [],
    [audioTypes.english],
    [audioTypes.english, audioTypes.meow],
  ]);

  const subtitles = [audioTypes.english];
  if (additionalContentAudioTypes.includes(audioTypes.english)) {
    subtitles.push(subtitleTypes.englishClosedCaptioned);
  }

  let items: ContentItem[] = [];

  if (type == "movie") {
    const [url, totalDuration] = chooseRandomFromArray(possibleCatMovies);
    items.push({
      id: faker.datatype.uuid(),
      title: "Movie",
      image: getRandomCatImage(240, 135)[0],
      description: generateRandomDescription(),
      source: {
        source: "youtube",
        metadata: {
          url,
          totalDuration,
        },
      },
    });
  }

  if (type == "series") {
    const howManyEpisodes = chooseRandomFromArray([12, 13, 24, 25, 26, 13, 52]);
    const howManyEpisodesPerSeason = chooseRandomFromArray([13, 26]);

    items = items.concat([
      ...Array(howManyEpisodes)
        .fill(undefined)
        .map((_, i) => generateContentEpisode(i + 1, howManyEpisodesPerSeason)),
    ]);
  }

  const [asFeed, imageId] = getRandomCatImage(150, 225);

  return {
    id,
    title,
    description,
    type,
    items,
    genres: sampleSize(possibleGenres, 3),
    images: {
      asFeed,
      asPageHeader: getRandomCatImage(1200, 675, imageId)[0],
    },
    originalAudioType,
    additionalContentAudioTypes,
    subtitles,
  };
}

export function generateContentGroups(howMany: number): ContentGroup[] {
  const howManyToMake = howMany - contentGroups.length;
  const id = contentGroups.length;

  return [
    ...contentGroups.map((contentGroup) => ({
      ...generateContentGroup(contentGroup.id as ID, contentGroup),
      ...contentGroup,
    })),
    ...Array(howManyToMake)
      .fill(undefined)
      .map((_, i) => generateContentGroup(i + id + 1)),
  ];
}

function getContentFeedItems(contentGroups: ContentGroup[], size: number) {
  return sampleSize(contentGroups, size);
}

const MAX_MINI_HEROS = 2;
let currentMiniHeros = 0;
function chooseRandomContentFeedType() {
  if (currentMiniHeros >= MAX_MINI_HEROS) {
    return "carousel";
  }

  const nextFeedType = chooseRandomFromArray(["mini-hero", "carousel"]);

  if (nextFeedType === "mini-hero") {
    currentMiniHeros = currentMiniHeros + 1;
  }

  return nextFeedType;
}

export function generateContentFeed(
  id: ID,
  overrides: Partial<ContentFeed> = {},
  contentGroups: ContentGroup[]
): ContentFeed {
  const type = overrides.type || chooseRandomContentFeedType();
  let items: ContentGroup[] = overrides.items || [];

  if (!items.length) {
    switch (type) {
      case "carousel":
        items = getContentFeedItems(
          contentGroups,
          chooseRandomFromArray([10, 15])
        );
        break;
      case "hero":
      case "mini-hero":
        items = getContentFeedItems(contentGroups, 1);
        break;
    }
  }

  return {
    id,
    title: getRandomCatTitle(),
    description: generateRandomDescription(),
    type,
    items,
  };
}

export function generateContentFeeds(
  howManyContentFeedItems: number,
  contentGroups: ContentGroup[]
): ContentFeed[] {
  const howManyToMake = howManyContentFeedItems - contentFeeds.length;
  const id = contentFeeds.length;

  return [
    ...contentFeeds.map((contentFeed, i) => ({
      ...generateContentFeed(i + 1, contentFeed, contentGroups),
      ...contentFeed,
    })),
    ...Array(howManyToMake)
      .fill(undefined)
      .map((_, i) => generateContentFeed(i + id + 1, {}, contentGroups)),
  ];
}

export async function main(
  howManyContentGroups = 150,
  howManyContentFeeds = 15
) {
  const contentGroups = generateContentGroups(howManyContentGroups);
  const contentFeeds = generateContentFeeds(howManyContentFeeds, contentGroups);
  const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

  // HACK: this makes Rent-A-Neko data populated
  contentFeeds[0].items = [contentGroups[0]];

  await fs.writeFile(
    path.resolve(__dirname, "./fixtures/contentGroups.json"),
    JSON.stringify(contentGroups, null, 2)
  );
  await fs.writeFile(
    path.resolve(__dirname, "./fixtures/contentFeeds.json"),
    JSON.stringify(contentFeeds, null, 2)
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
