import fs from 'fs';

const QUERY = `#graphql
query selectProblem($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    difficulty
  }
}`;

async function request(slug) {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: {
          titleSlug: slug
        },
      }),
    });

    console.log(`${response.status} - ${slug}`);
    const result = await response.json();


    if (result.errors) {
      throw new Error(`Error fetching data for ${slug}: ${result.errors.map(e => e.message).join(', ')}`);
    }

    return result.data.question.difficulty;
  } catch (err) {
    console.error('Error: ', err);
  }
}

async function processLine(line) {
  const items = line.trim().split('\t');

  const rating = Number(items[0]);
  const id = Number(items[1]);
  const name = items[2];
  const slug = items[4];

  const difficulty = await request(slug);

  return {
    rating,
    id,
    name,
    slug,
    difficulty
  };
}

async function scrape() {
  const file = fs.readFileSync('./public/ratings.txt', 'utf8');
  const lines = file.split('\n').slice(1, -1); // Remove header and last empty line

  const promises = [];

  let counter = 0;
  for (const line of lines) {
    promises.push(processLine(line));

    counter++;
    if (counter % 20 === 0) {
      // Throttle requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  const problems = await Promise.all(promises);

  const json = JSON.stringify(problems, null, 2);

  fs.writeFile('./public/data.json', json, (err) => {
    if (err) {
      console.error('Error writing file', err);
    } else {
      console.log('Successfully wrote to data.json');
    }
  });
}

scrape();