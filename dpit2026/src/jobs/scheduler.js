const cron = require('node-cron');
const irrigationService = require('../services/irrigationService');
const scheduleService = require('../services/scheduleService');

const activeTasks = new Map();

function buildCronExpression({ minute, hour, days_of_week }) {
  return `${minute} ${hour} * * ${days_of_week || '*'}`;
}

function registerTask(schedule) {
  const task = cron.schedule(buildCronExpression(schedule), async () => {
    console.log(`[scheduler] Running schedule ${schedule.id} for zone ${schedule.zone}`);
    try {
      const result = await irrigationService.autoWater(schedule.zone, schedule.duration_seconds);
      console.log(`[scheduler] ${schedule.zone}:`, result);
    } catch (err) {
      console.error(`[scheduler] Schedule ${schedule.id} failed:`, err.message);
    }
  });
  activeTasks.set(schedule.id, task);
}

async function start() {
  const schedules = await scheduleService.getEnabledSchedules();
  let active = 0;
  for (const schedule of schedules) {
    try {
      registerTask(schedule);
      active++;
    } catch (err) {
      console.error(`[scheduler] Skipping schedule ${schedule.id}:`, err.message);
    }
  }
  console.log(`[scheduler] ${active} schedule(s) active`);
}

function addOrUpdateTask(schedule) {
  removeTask(schedule.id);
  if (schedule.enabled) registerTask(schedule);
}

function removeTask(id) {
  const task = activeTasks.get(id);
  if (task) {
    task.stop();
    activeTasks.delete(id);
  }
}

module.exports = { start, addOrUpdateTask, removeTask };