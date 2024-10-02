import axios from 'axios';
import 'dotenv/config';
import { gotify } from 'gotify';
import notifier from 'node-notifier';

const useGotify = Boolean(process.env.GOTIFY_URL);

const URL = process.env.URL as string;
const DELAY = isNaN(Number(process.env.DELAY_MS))
  ? 600000
  : Number(process.env.DELAY_MS);

const main = async () => {
  let currentNumberOfProperties = 0;

  const checkAndNotify = async () => {
    const newNumberOfProperties = await getNumberOfProperties();
    if (newNumberOfProperties > currentNumberOfProperties) {
      const title = `There are ${
        newNumberOfProperties - currentNumberOfProperties
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
    currentNumberOfProperties = newNumberOfProperties;
  };
  await checkAndNotify();
  setInterval(async () => {
    await checkAndNotify();
  }, DELAY);
};

const getNumberOfProperties = async () => {
  const result = await axios.get(URL);
  const htmlText = result.data as string;
  if (!htmlText) {
    throw new Error(JSON.stringify(result));
  }
  const numberSpan = htmlText.split(
    `<span class="searchHeader-resultCount" data-bind="counter: resultCount, formatter: numberFormatter">`
  )[1];
  const numberOfProperties = Number(numberSpan.split('</span>')[0]);
  console.log(`Number of properties: ${numberOfProperties}`);
  console.log(
    `Data retrival completed at: ${new Date().toLocaleTimeString()}. Waiting ${millisToMinutesAndSeconds(
      DELAY
    )} seconds till next data fetch.`
  );
  return numberOfProperties;
};

const millisToMinutesAndSeconds = (millis: number) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = Number(((millis % 60000) / 1000).toFixed(0));
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

main();
