import db from "../config/firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment-timezone";

const startHours = 8; // 8 AM
const endHours = 17; // 5 PM
const duration = 30; // Slot duration in minutes
const defaultTimezone = "US/Eastern"; // Updated timezone

export const getFreeSlots = async (req, res) => {
  const { date, timezone = defaultTimezone } = req.query;
  const selectedDate = moment.tz(date, timezone).startOf("day");

  try {
    const eventsRef = collection(db, "events");
    const eventsQuery = query(
      eventsRef,
      where("startTime", ">=", selectedDate.toISOString()),
      where("startTime", "<", selectedDate.add(1, "day").toISOString())
    );
    const eventsSnapshot = await getDocs(eventsQuery);

    // Extract booked times with duration consideration
    const bookedTimes = eventsSnapshot.docs.map((doc) => {
      const { startTime, duration } = doc.data();
      return {
        start: moment.tz(startTime, timezone),
        end: moment.tz(startTime, timezone).add(duration, "minutes"),
      };
    });

    // Calculate free slots
    let slots = [];
    let startTime = moment
      .tz(date, timezone)
      .hours(startHours)
      .minutes(0)
      .seconds(0);
    let endTime = moment
      .tz(date, timezone)
      .hours(endHours)
      .minutes(0)
      .seconds(0);

    while (startTime.isBefore(endTime)) {
      const isBooked = bookedTimes.some(
        (time) => startTime.isBetween(time.start, time.end, null, "[]") // includes start and end
      );

      if (!isBooked) {
        slots.push(startTime.format());
      }
      startTime.add(duration, "minutes");
    }

    return res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
