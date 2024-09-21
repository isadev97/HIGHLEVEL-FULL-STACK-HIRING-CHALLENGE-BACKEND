# Calendar Appointment Booking System

## Overview

A simple API for scheduling appointments, allowing users to view available time slots and book events.

## Features

- **View Free Slots**: Check available time slots for appointments.
- **Create Events**: Book appointments with specified date and duration.
- **Get Events**: Retrieve all booked events within a date range.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: Firestore (Firebase)
- **Date Handling**: Moment.js

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Firebase account with Firestore enabled

### Installation

1. Clone the repository:
   git clone <repository-url>
   cd calendar-appointment-booking

2. Install dependencies:
   npm install

### Configuration

1. Set up Firebase in `config/firebase.js` with your project details.
2. Create a `.env` file for sensitive data if necessary.

### Starting the Server

Run the server with:
npm start
The API will be accessible at `http://localhost:5000`.

## API Endpoints

### 1. Get Free Slots

- **URL**: `/api/slots`
- **Method**: `GET`
- **Query Params**: 
  - `date` (YYYY-MM-DD)
  - `timezone` (optional, defaults to `America/Los_Angeles`)

**cURL Example**:
curl -X GET "http://localhost:5000/api/slots?date=2023-09-30&timezone=America/New_York"

### 2. Create Event

- **URL**: `/api/events`
- **Method**: `POST`
- **Body**: 
  - `dateTime` (ISO 8601 format)
  - `duration` (integer, in minutes)

**cURL Example**:
curl -X POST "http://localhost:5000/api/events" \
-H "Content-Type: application/json" \
-d '{"dateTime": "2023-09-30T10:00:00Z", "duration": 30}'

### 3. Get Events

- **URL**: `/api/events`
- **Method**: `GET`
- **Query Params**:
  - `startDate` (YYYY-MM-DD)
  - `endDate` (YYYY-MM-DD)

**cURL Example**:
curl -X GET "http://localhost:5000/api/events?startDate=2023-09-01&endDate=2023-09-30"

## Testing

Use Postman for manual testing or set up Jest for automated tests.

### Example cURL Commands for Testing

1. **Check Free Slots**:
   curl -X GET "http://localhost:5000/api/slots?date=2023-09-30&timezone=America/New_York"

2. **Create a New Event**:
   curl -X POST "http://localhost:5000/api/events" \
   -H "Content-Type: application/json" \
   -d '{"dateTime": "2023-09-30T10:00:00Z", "duration": 30}'

3. **Retrieve Events**:
   curl -X GET "http://localhost:5000/api/events?startDate=2023-09-01&endDate=2023-09-30"

## Error Handling

Standard HTTP errors for invalid requests and server issues. 
- **422**: Slot already booked
- **500**: Internal server error

## License

This project is licensed under the MIT License.

## Acknowledgments

- Moment.js for date handling.
- Firebase for database management.
