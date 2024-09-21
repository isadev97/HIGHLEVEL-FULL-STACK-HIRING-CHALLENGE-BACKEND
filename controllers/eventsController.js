import db from "../config/firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import moment from "moment-timezone";

// Create an event
export const createEvent = async (req, res) => {
  const { dateTime, duration } = req.body;

  try {
    const startTime = moment(dateTime).toISOString();

    // Check if the slot is already booked
    const eventsRef = collection(db, "events");
    const eventsQuery = query(eventsRef, where("startTime", "==", startTime));
    const existingEvent = await getDocs(eventsQuery);

    if (!existingEvent.empty) {
      return res.status(422).json({ message: "Slot already booked" });
    }

    // Create new event
    await addDoc(eventsRef, { startTime, duration });
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
      where("date", ">=", moment(startDate).toISOString()),
      where("date", "<=", moment(endDate).toISOString())
    );

    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map((doc) => doc.data());

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
