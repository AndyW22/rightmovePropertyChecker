import axios from 'axios';
import notifier from 'node-notifier';

const url =
  'https://www.rightmove.co.uk/property-to-rent/find.html?searchType=RENT&locationIdentifier=REGION%5E93829&insId=1&radius=0.0&minPrice=&maxPrice=&minBedrooms=&maxBedrooms=1&displayPropertyType=&maxDaysSinceAdded=&sortByPriceDescending=&_includeLetAgreed=on&primaryDisplayPropertyType=&secondaryDisplayPropertyType=&oldDisplayPropertyType=&oldPrimaryDisplayPropertyType=&letType=&letFurnishType=&houseFlatShare=';

const main = async () => {
  let currentNumberOfProperties = 0;
  setInterval(async () => {
    console.log('Fetching url...');
    const data = await axios.get(url);
    console.log('Data retrieved');
    const text = data.data as string;
    if (!text) {
      throw new Error(JSON.stringify(data));
    }
    const item = text.split(
      `<span class="searchHeader-resultCount" data-bind="counter: resultCount, formatter: numberFormatter">`
    )[1];
    const numberOfProperties = Number(item.substring(0, 2));
    console.log(`Number of properties: ${numberOfProperties}`);
    if (numberOfProperties !== currentNumberOfProperties) {
      notifier.notify(
        `There are ${
          numberOfProperties - currentNumberOfProperties
        } new properties avaiable`
      );
      currentNumberOfProperties = numberOfProperties;
    }
    const today = new Date();
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    console.log(`Data retrival completed at: ${time}`);
  }, 120000);
};

main();
