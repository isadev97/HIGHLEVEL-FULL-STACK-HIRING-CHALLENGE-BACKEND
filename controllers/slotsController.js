import db from "../config/firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import moment from "moment-timezone";

const startHours = 8;
const endHours = 17;
const duration = 30;
const defaultTimezone = "US/Eastern";

export const getFreeSlots = async (req, res) => {
  const { date, timezone = defaultTimezone } = req.query;
  const selectedDate = moment.tz(date, timezone).startOf("day");

  try {
    const bookedTimes = await fetchBookedTimes(selectedDate, timezone);
    const slots = calculateFreeSlots(bookedTimes, selectedDate, timezone);
    return res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fetchBookedTimes = async (selectedDate, timezone) => {
  const eventsRef = collection(db, "events");
  const eventsQuery = query(
    eventsRef,
    where("startTime", ">=", selectedDate.toISOString()),
    where("startTime", "<", selectedDate.clone().add(1, "day").toISOString())
  );

  const eventsSnapshot = await getDocs(eventsQuery);

  return eventsSnapshot.docs.map((doc) => {
    const { startTime, duration } = doc.data();
    return {
      start: moment.tz(startTime, timezone),
      end: moment.tz(startTime, timezone).add(duration, "minutes"),
    };
  });
};

const calculateFreeSlots = (bookedTimes, selectedDate, timezone) => {
  const slots = [];
  let startTime = moment
    .tz(selectedDate, timezone)
    .hours(startHours)
    .minutes(0)
    .seconds(0);
  const endTime = moment
    .tz(selectedDate, timezone)
    .hours(endHours)
    .minutes(0)
    .seconds(0);

  while (startTime.isBefore(endTime)) {
    const slotEndTime = startTime.clone().add(duration, "minutes");
    const isBooked = bookedTimes.some(
      (time) => startTime.isBefore(time.end) && slotEndTime.isAfter(time.start)
    );
    if (!isBooked) {
      slots.push(startTime.format("YYYY-MM-DDTHH:mm:ss"));
    }
    startTime.add(duration, "minutes");
  }

  return slots;
};
