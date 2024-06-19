import axios from 'axios';
import 'dotenv/config';
import { gotify } from 'gotify';
import notifier from 'node-notifier';

const useGotify = Boolean(process.env.GOTIFY_URL);

const URL = process.env.URL as string;
const DELAY = Number(process.env.DELAY_MS) ?? 120000;

const main = async () => {
  let currentNumberOfProperties = 0;

  const retrieveData = async () => {
    const result = await getData();
    if (result > currentNumberOfProperties) {
      const title = `There are ${
        result - currentNumberOfProperties
      } new properties available!`;

      if (useGotify) {
        await gotify({
          server: process.env.GOTIFY_URL!,
          app: process.env.GOTIFY_TOKEN!,
          title,
          message: URL,
          priority: 10,
        });
      } else {
        notifier.notify({
          title,
          message: URL,
          sound: true,
        });
      }
    }
    currentNumberOfProperties = result;
  };
  await retrieveData();
  setInterval(async () => {
    await retrieveData();
  }, DELAY);
};

const getData = async () => {
  console.log(`Fetching data...`);
  const data = await axios.get(URL);
  const text = data.data as string;
  if (!text) {
    throw new Error(JSON.stringify(data));
  }
  const numberText = text.split(
    `<span class="searchHeader-resultCount" data-bind="counter: resultCount, formatter: numberFormatter">`
  )[1];
  const numberOfProperties = Number(numberText.split('</span>')[0]);
  console.log(`Number of properties: ${numberOfProperties}`);
  console.log(
    `Data retrival completed at: ${new Date().toLocaleTimeString()}. Waiting ${millisToMinutesAndSeconds(
      DELAY
    )} minutes till next data fetch.`
  );
  return numberOfProperties;
};

const millisToMinutesAndSeconds = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Number(((millis % 60000) / 1000).toFixed(0));
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

main();
