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

  let contentOld = [];
  let contentNew = [];
  let isFirstRun = true;
  while (true) {
    const days = await getAvailableDays("copper");
    // console.log("Available days at Copper:");
    // console.log(days);
    contentOld = contentNew;
    contentNew = days;
    const newlyAvailable = availabilityHasChanged(contentOld, contentNew);
    if (newlyAvailable && !isFirstRun) {
      console.log("Sending message...");
      // const message = "Available Days at Copper: \n" + days.length;
      const message = "New Reservation Available on: \n" + newlyAvailable.name;
      sendEmail(process.env.RECIPIENT, message);
    } else {
      console.log("No new reservations.");
    }
    isFirstRun = false;
    await sleep(15000);
  }
})().listen(process.env.PORT || 5000);
