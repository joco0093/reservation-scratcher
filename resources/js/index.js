"use strict";

var _dotenv = require("dotenv");

var _getAvailableDays = require("./getAvailableDays.js");

var _emailService = require("./emailService.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

let eldoraEn = false;
let copperEn = true;

(async function () {
  const sleep = m => new Promise(r => setTimeout(r, m));

  const availabilityHasChanged = (oldDays, newDays) => {
    // if newdays contains a day with an id not present in old days
    for (const day of newDays) {
      if (!oldDays.map(d => {
        return d.id;
      }).includes(day.id)) {
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
    const copperDays = await (0, _getAvailableDays.getAvailableDays)("copper");
    const eldoraDays = await (0, _getAvailableDays.getAvailableDays)("eldora"); // console.log("Available days at Copper:");
    // console.log(days);

    contentOldCopper = contentNewCopper;
    contentNewCopper = copperDays;
    contentOldEldora = contentNewEldora;
    contentNewEldora = eldoraDays;
    const newlyAvailableCopper = availabilityHasChanged(contentOldCopper, contentNewCopper);

    if (newlyAvailableCopper && !isFirstRun && copperEn) {
      console.log("Sending message...");
      const message = "New Reservation Available at Copper on: \n" + newlyAvailableCopper.name;
      (0, _emailService.sendEmail)(process.env.RECIPIENT, message);
    } else {
      console.log("No new reservations at Copper.");
    }

    const newlyAvailableEldora = availabilityHasChanged(contentOldEldora, contentNewEldora);

    if (newlyAvailableEldora && !isFirstRun && eldoraEn) {
      console.log("Sending message...");
      let formattedTime = newlyAvailableEldora.time.substring(11, 16);
      const message = "New Reservation Available at Eldora on: \n" + newlyAvailableEldora.name + " at " + formattedTime;
      (0, _emailService.sendEmail)(process.env.RECIPIENT, message);
    } else {
      console.log("No new reservations at Eldora.");
    }

    isFirstRun = false;
    await sleep(15000);
  }
})();