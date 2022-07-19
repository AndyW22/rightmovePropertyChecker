import axios from 'axios';
import notifier from 'node-notifier';

const URL =
  'https://www.rightmove.co.uk/property-to-rent/find.html?searchType=RENT&locationIdentifier=REGION%5E93829&insId=1&radius=0.0&minPrice=&maxPrice=&minBedrooms=&maxBedrooms=1&displayPropertyType=&maxDaysSinceAdded=&sortByPriceDescending=&_includeLetAgreed=on&primaryDisplayPropertyType=&secondaryDisplayPropertyType=&oldDisplayPropertyType=&oldPrimaryDisplayPropertyType=&letType=&letFurnishType=&houseFlatShare=';
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
  const item = text.split(
    `<span class="searchHeader-resultCount" data-bind="counter: resultCount, formatter: numberFormatter">`
  )[1];
  const numberOfProperties = Number(item.substring(0, 2));
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
