import cron from "node-cron";

let queue = [];
process.on("message", (data) => {
  queue.push(data);
});

cron.schedule("*/1 * * * * *", () => {
  for (let queueLength = 0; queueLength < queue.length; queueLength++) {
    let data = queue[queueLength];
    console.log(data.scheduleTime);
    data.scheduleTime = data.scheduleTime - 1;
    if (data.scheduleTime <= 0) {
      console.log("Done");
      process.send(data);
      queue = queue.filter((q) => q.messageId !== data.messageId);
    }
  }
});
