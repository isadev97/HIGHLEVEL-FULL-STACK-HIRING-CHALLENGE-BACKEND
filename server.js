import express from "express";
import bodyParser from "body-parser";
import slotsRoutes from "./routes/slots.js";
import eventsRoutes from "./routes/events.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use("/api/slots", slotsRoutes);
app.use("/api/events", eventsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
