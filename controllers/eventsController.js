import db from "../config/firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import moment from "moment-timezone";

const startHours = 8;
const endHours = 17;
const slotDuration = 30;
const defaultTimezone = "US/Eastern";

export const createEvent = async (req, res) => {
  const { dateTime, duration: eventDuration } = req.body;

  try {
    const startTime = moment.tz(dateTime, defaultTimezone);
    if (!startTime.isValid() || !eventDuration || eventDuration <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }
    if (!isTimeInRange(startTime, eventDuration)) {
      return res.status(422).json({ message: "Event time is out of range" });
    }
    const isSlotBooked = await checkIfSlotBooked(startTime, eventDuration);
    if (isSlotBooked) {
      return res.status(422).json({ message: "Slot already booked" });
    }
    await addDoc(collection(db, "events"), {
      startTime: startTime.toISOString(),
      duration: eventDuration,
    });
    return res.status(200).json({ message: "Event created successfully" });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const isTimeInRange = (time, duration) => {
  const endTime = time.clone().add(duration, "minutes");
  return time.hours() >= startHours && endTime.hours() <= endHours;
};
const checkIfSlotBooked = async (startTime, eventDuration) => {
  const eventsRef = collection(db, "events");
  const eventsQuery = query(
    eventsRef,
    where("startTime", ">=", startTime.toISOString()),
    where(
      "startTime",
      "<",
      startTime.clone().add(eventDuration, "minutes").toISOString()
    )
  );

  const existingEvent = await getDocs(eventsQuery);
  return !existingEvent.empty;
};
export const getEvents = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const events = await fetchEventsInRange(startDate, endDate);
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const fetchEventsInRange = async (startDate, endDate) => {
  const eventsRef = collection(db, "events");
  const eventsQuery = query(
    eventsRef,
    where(
      "startTime",
      ">=",
      moment.tz(startDate, defaultTimezone).toISOString()
    ),
    where("startTime", "<=", moment.tz(endDate, defaultTimezone).toISOString())
  );

  const eventsSnapshot = await getDocs(eventsQuery);
  return eventsSnapshot.docs.map((doc) => doc.data());
};
export const getAvailableSlots = () => {
  const slots = [];
  for (let hour = startHours; hour < endHours; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const slotTime = moment.tz({ hour, minute }, defaultTimezone);
      slots.push(slotTime.format("HH:mm"));
    }
  }
  return slots;
};
