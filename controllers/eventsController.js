import db from "../config/firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import moment from "moment-timezone";

// Configuration constants
const startHours = 8; // 8 AM
const endHours = 17; // 5 PM
const duration = 30; // Slot duration in minutes
const defaultTimezone = "US/Eastern"; // Updated timezone

// Create an event
export const createEvent = async (req, res) => {
  const { dateTime, duration: eventDuration } = req.body;

  try {
    const startTime = moment.tz(dateTime, defaultTimezone); // Parse the dateTime in the specified timezone

    // Check if the time is within the allowed range
    if (startTime.hours() < startHours || startTime.hours() >= endHours) {
      return res.status(422).json({ message: "Event time is out of range" });
    }

    // Check if the slot is already booked
    const eventsRef = collection(db, "events");
    const eventsQuery = query(
      eventsRef,
      where("startTime", ">=", startTime.toISOString()),
      where(
        "startTime",
        "<",
        moment(startTime).add(eventDuration, "minutes").toISOString()
      )
    );
    const existingEvent = await getDocs(eventsQuery);

    if (!existingEvent.empty) {
      return res.status(422).json({ message: "Slot already booked" });
    }

    // Create new event
    await addDoc(eventsRef, {
      startTime: startTime.toISOString(),
      duration: eventDuration,
    });
    return res.status(200).json({ message: "Event created successfully" });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all events in the date range
export const getEvents = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const eventsRef = collection(db, "events");
    const eventsQuery = query(
      eventsRef,
      where(
        "startTime",
        ">=",
        moment.tz(startDate, defaultTimezone).toISOString()
      ),
      where(
        "startTime",
        "<=",
        moment.tz(endDate, defaultTimezone).toISOString()
      )
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map((doc) => doc.data());

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
