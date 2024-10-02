# Rightmove property checker

Rightmove property alerts are often delayed by hours or days, this repository is a simple NodeJS script which will periodically visit a given URL on Rightmove and send an OS notification if there are new properties available, so you can be one of the first to view it.

## Usage

`pnpm install` or your preferred package manager

Create a `.env` file and add the URL for your property search on Rightmove. To obtain the URL, simply make a search for any location with any filter, max/min price or number of beds and copy the URL.

For example, 1 bedrom apartments in York up to £1000/pcm:

```
URL="https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E1498&maxBedrooms=1&maxPrice=1000&propertyTypes=&includeLetAgreed=false&mustHave=&dontShow=&furnishTypes=&keywords="
```

Start the script with `npm start` or `yarn start`.
To verify it is working correctly, you should get a notification on the first iteration for the current number of properties available.

## Gotify

This app supports notifying via Gotify. To enable, add the following values to `.env`:

```
GOTIFY_URL="..."
GOTIFY_TOKEN="..."

```

## Notes

Rightmove can sometimes have a delay between the number of properties shown at the top, and the actual number of properties shown in the search results. It can take up to 10 minutes for the new property/properties to show.
