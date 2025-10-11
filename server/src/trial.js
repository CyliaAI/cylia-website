import schedule from 'node-schedule';

// Runs every minute
schedule.scheduleJob('* * * * *', () => {
  console.log('This runs every minute');
});
