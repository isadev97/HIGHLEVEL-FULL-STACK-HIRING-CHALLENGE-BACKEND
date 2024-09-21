import db from "../config/firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import moment from "moment-timezone";

// Configuration constants
const startHours = 8; // 8 AM
const endHours = 17; // 5 PM
const defaultTimezone = "US/Eastern"; // Updated timezone

// Create an event
export const createEvent = async (req, res) => {
  const { dateTime, duration: eventDuration } = req.body;

  try {
    const startTime = moment.tz(dateTime, defaultTimezone); // Parse the dateTime in the specified timezone

    // Validate event time range
    if (!isTimeInRange(startTime, eventDuration)) {
      return res.status(422).json({ message: "Event time is out of range" });
    }

    // Check if the slot is already booked
    const isSlotBooked = await checkIfSlotBooked(startTime, eventDuration);
    if (isSlotBooked) {
      return res.status(422).json({ message: "Slot already booked" });
    }

    // Create new event
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

// Validate if the time is within the allowed range
const isTimeInRange = (time, duration) => {
  const endTime = time.clone().add(duration, "minutes");
  return time.hours() >= startHours && endTime.hours() <= endHours; // Changed to <= for end time
};

// Check if the slot is already booked
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

// Get all events in the date range
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

// Fetch events within a specific date range
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
