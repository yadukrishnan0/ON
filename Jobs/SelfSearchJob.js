// jobs/selfSearchJob.js
const axios = require("axios");
const cron = require("node-cron");
const Citys = require("../Unique/ONDCCONTEXTCITY.js");
const isoTimestamp = require("../Unique/Time.js");

const makeSearchRequest = async (endpoint, body) => {
  const { city_code, start_time, end_time } = body;
  console.log(body)
  try {
   
    const response = await axios.post(endpoint, body);
    
    console.log(`Response from ${endpoint} for city ${city_code}:`, response.data);
  } catch (error) {
    console.error(`Error in search request to ${endpoint}:`, error.message);
  }
};

const throttleRequests = async (requests, limit) => {
  const results = [];
  for (let i = 0; i < requests.length; i += limit) {
    const chunk = requests.slice(i, i + limit);
    const promises = chunk.map((request) => request());
    results.push(...(await Promise.all(promises)));
  }
  return results;
};

let isFirstCallComplete = false;

const executeFullSearch = async () => {
  console.log("Running initial full search...");
  const requests = Citys.map(
    (city) => () =>
      makeSearchRequest("https://ondc.eatiko.com/self/full", {city_code:city.Code})
  );
  await throttleRequests(requests, 10);
  isFirstCallComplete = true;
  console.log(
    "Initial full search completed. Incremental search will now run every 3 hours."
  );
};

cron.schedule("0 */3 * * *", async () => {
  if (isFirstCallComplete) {
    console.log("Running incremental search...");
    const requests = Citys.map(
      (city) => () =>
        makeSearchRequest("https://ondc.eatiko.com/self/inc", {
          city_code: city.Code,
          start_time: isoTimestamp,
          end_time: isoTimestamp+12*60*60*1000
        })
    );
    await throttleRequests(requests, 10);
  } else {
    console.log(
      "Incremental search skipped as the first full search is not complete yet."
    );
  }
});

cron.schedule("0 */12 * * *", async () => {
  console.log("Running full search...");
  await executeFullSearch();
});

executeFullSearch();
