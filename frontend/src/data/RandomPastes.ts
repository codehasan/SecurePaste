import { Paste } from '@prisma/client';
import { v4 } from 'uuid';

const randomWords = [
  'Apple',
  'Avocado',
  'Advert',
  'Addon',
  'Berry',
  'Basketball',
  'Ball',
  'Born',
  'Bug',
  'Coconut',
  'Candy',
  'Car',
  'Crash',
  'Date',
  'Dare',
  'Deed',
  'Eggplant',
  'Entertainment',
  'Excersize',
  'Extra',
  'Fruit',
  'Fast',
  'Furious',
  'Fantastic',
  'Grape',
  'Game',
  'Great',
  'Gigantic',
  'Horse',
  'Holo',
  'Hay',
  'Ink',
  'International',
  'Jackfruit',
  'Jackel',
  'Janitor',
  'Kate',
  'King',
  'Kind',
  'Lemon',
  'Lend',
  'Limit',
  'Mango',
  'Mud',
  'Male',
  'Mind',
  'Nitrogen',
  'None',
  'Nice',
  'Olive',
  'Obvious',
  'Pharma',
  'Permanent',
  'Quad',
  'Queen',
  'Rose',
  'Red',
  'Salmon',
  'Sentry',
  'Tulip',
  'Turn',
  'Tangent',
  'Umbrella',
  'Undo',
  'Violet',
  'Vague',
  'Watermelon',
  'Wow',
  'Xavier',
  'Yellow',
  'Yandex',
  'Zayn',
  'Zach',
  'Zillow',
];
const seed = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  '01234567890',
];

function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomMessageV1() {
  // random between 6 and 25
  const stringLen = Math.floor(Math.random() * 20 + 6);
  const randomString: string[] = [];

  randomString[0] = (() => {
    // uppercase letter
    let firstWord = seed[0][Math.floor(Math.random() * seed[0].length)];
    const wordLen = Math.floor(Math.random() * 4 + 4);

    for (let i = 0; i < wordLen; i++) {
      // lowercase letter
      firstWord += seed[1][Math.floor(Math.random() * seed[1].length)];
    }
    return firstWord;
  })();

  for (let i = 1; i < stringLen; i++) {
    let randomWord = '';
    const wordLen = Math.floor(Math.random() * 4 + 4);

    for (let j = 0; j < wordLen; j++) {
      randomWord += seed[1][Math.floor(Math.random() * seed[1].length)];
    }
    randomString[i] = randomWord;
  }

  return randomString.join(' ') + '.';
}

function getRandomMessageV2(min: number, max: number) {
  // random between 6 and 25
  const stringLen = Math.floor(Math.random() * 20 + 6);
  const randomString: string[] = [];

  randomString[0] = randomWords[Math.floor(Math.random() * randomWords.length)];

  for (let i = 1; i < stringLen; i++) {
    let word =
      randomWords[Math.floor(Math.random() * randomWords.length)].toLowerCase();

    while (word in randomString)
      word =
        randomWords[
          Math.floor(Math.random() * randomWords.length)
        ].toLowerCase();

    randomString[i] = word;
  }
  return randomString.join(' ') + '.';
}

function getRandomTags(min: number, max: number) {
  const tagsCount = getRandom(min, max);
  const tags = [];

  for (let i = 0; i < tagsCount; i++) {
    tags[i] = randomWords[getRandom(0, randomWords.length)];
  }
  return tags;
}

function generateRandomPastes() {
  const userId = '4a085585-7953-4afb-b3f3-665c9c5e79b9';
  const randomPastes = [];

  for (let i = 0; i < 20; i++) {
    const paste: Paste = {
      id: v4(),
      title: getRandomMessageV2(10, 20),
      bodyOverview:
        getRandomMessageV2(20, 30) +
        '\n' +
        getRandomMessageV2(20, 30) +
        '\n' +
        getRandomMessageV2(20, 30) +
        '\n' +
        getRandomMessageV2(20, 30) +
        '\n' +
        getRandomMessageV2(20, 30) +
        '\n' +
        getRandomMessageV2(20, 30),
      bodyUrl: '',
      syntax: 'plaintext',
      userId,
      likesCount: 0,
      commentsCount: 0,
      visitsCount: 0,
      updatedAt: new Date(),
      createdAt: new Date(),
      tags: getRandomTags(4, 10),
    };

    randomPastes[i] = paste;
  }
  console.log(JSON.stringify(randomPastes));
}
