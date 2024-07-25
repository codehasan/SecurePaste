import comments from '@/data/comments.json';
import { Comment } from '@prisma/client';
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

function getRandomMessageV2() {
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

function generateRandomComments() {
  const pasteId = 'd529b444-9220-41b6-b370-f2a929e0d80f';
  const userId = '4a085585-7953-4afb-b3f3-665c9c5e79b9';
  const randomComments = [];

  for (let i = 0; i < comments.length; i++) {
    const comment: Comment = {
      id: v4(),
      message: getRandomMessageV2(),
      parentId: comments[i].id,
      pasteId,
      userId,
      likesCount: 0,
      childrenCount: 0,
      updatedAt: new Date(),
      createdAt: new Date(),
    };

    randomComments[i] = comment;
  }
  console.log(JSON.stringify(randomComments));
}
