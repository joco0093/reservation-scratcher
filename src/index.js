import dotenv from "dotenv";
dotenv.config();

import { getAvailableDays } from "./getAvailableDays.js";
import { sendEmail } from "./emailService.js";

(async function () {
  const sleep = (m) => new Promise((r) => setTimeout(r, m));

  const availabilityHasChanged = (oldDays, newDays) => {
    // if newdays contains a day with an id not present in old days
    for (const day of newDays) {
      if (
        !oldDays
          .map((d) => {
            return d.id;
          })
          .includes(day.id)
      ) {
        return day; // New id in newDays
      }
    }
    return undefined;
  };

  console.log("Reservation Scratcher Started");
  console.log("Getting available days at Copper...");

  let contentOldCopper = [];
  let contentNewCopper = [];

  let contentOldEldora = [];
  let contentNewEldora = [];

  let isFirstRun = true;
  while (true) {
    const copperDays = await getAvailableDays("copper");
    const eldoraDays = await getAvailableDays("eldora");
    // console.log("Available days at Copper:");
    // console.log(days);
    contentOldCopper = contentNewCopper;
    contentNewCopper = copperDays;

    contentOldEldora = contentNewEldora;
    contentNewEldora = eldoraDays;

    const newlyAvailableCopper = availabilityHasChanged(contentOldCopper, contentNewCopper);
    if (newlyAvailableCopper && !isFirstRun) {
      console.log("Sending message...");
      const message = "New Reservation Available at Copper on: \n" + newlyAvailableCopper.name;
      sendEmail(process.env.RECIPIENT, message);
    } else {
      console.log("No new reservations at Copper.");
    }

    const newlyAvailableEldora = availabilityHasChanged(contentOldEldora, contentNewEldora);
    if (newlyAvailableEldora && !isFirstRun) {
      console.log("Sending message...");
      const message = "New Reservation Available at Eldora on: \n" + newlyAvailableEldora.name + "at " + newlyAvailableEldora.start_time;
      sendEmail(process.env.RECIPIENT, message);
    } else {
      console.log("No new reservations at Eldora.");
    }

    isFirstRun = false;
    await sleep(15000);
  }
})();
