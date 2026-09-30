const weatherService = require('./weatherService');
const consumptionService = require('./consumptionService');
const deviceService = require('./deviceService');

const DEFAULT_DURATION_SECONDS = 300;
const FLOW_RATE_LPM = 8;

async function waterNow(zone, durationSeconds = DEFAULT_DURATION_SECONDS) {
    const startedAt = new Date().toISOString();

    await deviceService.startZone(zone, durationSeconds);

    const { litersUsed } =  await consumptionService.recordEvent({
        zone,
        startedAt,
        durationSeconds,
        flowRateLpm: FLOW_RATE_LPM,
    });

    return { zone, durationSeconds, litersUsed, startedAt };
}

async function stopNow(zone) {
    await deviceService.stopZone(zone);
    return { zone, status: 'stopped' };
}

async function autoWater(zone, durationSeconds = DEFAULT_DURATION_SECONDS, rainThresholdPercent = 60) {
    const skip = await weatherService.shouldSkipWatering(rainThresholdPercent);

    if (skip) {
        return { zone, watered: false, reason: 'high rain chance' };
    }

    const result = await waterNow(zone, durationSeconds);
    return { zone, watered: true, ...result };
}

module.exports = {
    waterNow,
    stopNow,
    autoWater,
};