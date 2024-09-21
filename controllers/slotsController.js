import db from "../config/firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment-timezone";

const startHours = 10; // Example: 10 AM
const endHours = 17; // Example: 5 PM
const duration = 30; // Slot duration in minutes
const defaultTimezone = "America/Los_Angeles"; // Default timezone

export const getFreeSlots = async (req, res) => {
  const { date, timezone = defaultTimezone } = req.query;
  const selectedDate = moment.tz(date, timezone).startOf("day");

  try {
    const eventsRef = collection(db, "events");
    const eventsQuery = query(
      eventsRef,
      where("date", ">=", selectedDate.toISOString()),
      where("date", "<", selectedDate.add(1, "day").toISOString())
    );
    const eventsSnapshot = await getDocs(eventsQuery);

    // Extract booked times
    const bookedTimes = eventsSnapshot.docs.map((doc) => {
      const { startTime, duration } = doc.data();
      return moment(startTime).format();
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

    while (startTime < endTime) {
      if (!bookedTimes.includes(startTime.format())) {
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
