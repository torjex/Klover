const LATITUDE = process.env.LATITUDE;
const LONGITUDE = process.env.LONGITUDE;

const CACHE_TTL_MS = 30 * 60 * 1000; 
let cache = { data: null, fetchedAt: 0 };


async function fetchForecast() {
    const now = Date.now();
    if (cache.data && (now - cache.fetchedAt) < CACHE_TTL_MS) {
        return cache.data;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=precipitation_probability_max,precipitation_sum&current=temperature_2m,precipitation&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Weather API responded with status ${response.status}`);
    }
    const data = await response.json();

    cache = { data, fetchedAt: now };
    return data;
}

async function getRainChance() {
    const forecast = await fetchForecast();
    const todayIndex = 0;
    return {
        date: forecast.daily.time[todayIndex],
        rainChancePercent: forecast.daily.precipitation_probability_max[todayIndex],
        expectedMm: forecast.daily.precipitation_sum[todayIndex],
    };
}

async function shouldSkipWatering(thresholdPercent = 60) {
    const { rainChancePercent } = await getRainChance();
    return rainChancePercent >= thresholdPercent;
}

async function getCurrentConditions() {
    const forecast = await fetchForecast();
    return {
        temperatureC: forecast.current.temperature_2m,
        isRainingNow: forecast.current.precipitation > 0,
    };
}

module.exports = {
    getRainChance,
    shouldSkipWatering,
    getCurrentConditions,
};
