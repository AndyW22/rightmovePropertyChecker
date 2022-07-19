import axios from 'axios';
import 'dotenv/config';
import notifier from 'node-notifier';

const URL = process.env.URL as string;
const DELAY = 131374;

const main = async () => {
  let currentNumberOfProperties = 0;
  const result = await getData();
  if (result !== currentNumberOfProperties) {
    notifier.notify(
      `There are ${result - currentNumberOfProperties} new properties avaiable`
    );
    currentNumberOfProperties = result;
  }

  setInterval(async () => {
    const result = await getData();
    if (result !== currentNumberOfProperties) {
      notifier.notify(
        `There are ${
          result - currentNumberOfProperties
        } new properties avaiable`
      );
      currentNumberOfProperties = result;
    }
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
  const numberOfProperties = Number(numberText.substring(0, 2));
  console.log(`Number of properties: ${numberOfProperties}`);
  const today = new Date();
  const time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  console.log(
    `Data retrival completed at: ${time}. Waiting ${millisToMinutesAndSeconds(
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
