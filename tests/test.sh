#!/bin/bash

# Define the base URL for the API
BASE_URL="http://localhost:5000/api"

# Test Case 1: Check Free Slots on a Date with No Events
echo "Test Case 1: Check Free Slots"
curl -X GET "$BASE_URL/slots?date=2023-09-30&timezone=US/Eastern"
echo -e "\n"

# Test Case 2: Create Event Outside Available Hours
echo "Test Case 2: Create Event at 7:00 AM"
curl -X POST "$BASE_URL/events" -H "Content-Type: application/json" -d '{"dateTime": "2023-09-30T07:00:00-04:00", "duration": 30}'
echo -e "\n"

echo "Test Case 2: Create Event at 6:00 PM"
curl -X POST "$BASE_URL/events" -H "Content-Type: application/json" -d '{"dateTime": "2023-09-30T18:00:00-04:00", "duration": 30}'
echo -e "\n"

# Test Case 3: Create an Event at 8:30 AM for 30 Minutes
echo "Test Case 3: Create Event at 8:30 AM"
curl -X POST "$BASE_URL/events" -H "Content-Type: application/json" -d '{"dateTime": "2023-09-30T08:30:00-04:00", "duration": 30}'
echo -e "\n"

# Test Case 4: Check Free Slots Again
echo "Test Case 4: Check Free Slots After Event Creation"
curl -X GET "$BASE_URL/slots?date=2023-09-30&timezone=US/Eastern"
echo -e "\n"

# Test Case 5: Try to Create an Event at 8:30 AM Again with Any Duration
echo "Test Case 5: Create Event at 8:30 AM Again"
curl -X POST "$BASE_URL/events" -H "Content-Type: application/json" -d '{"dateTime": "2023-09-30T08:30:00-04:00", "duration": 15}'
echo -e "\n"

# Test Case 6: Try to create Event at 8:00 AM for 40 Minutes
echo "Test Case 6: Try to create Event at 8:00 AM for 40 Minutes"
curl -X POST "$BASE_URL/events" -H "Content-Type: application/json" -d '{"dateTime": "2023-09-30T08:00:00-04:00", "duration": 40}'
echo -e "\n"

# Test Case 7: Create an Event at 2:00 PM for 50 Minutes
echo "Test Case 7: Create Event at 2:00 PM for 50 Minutes"
curl -X POST "$BASE_URL/events" -H "Content-Type: application/json" -d '{"dateTime": "2023-09-30T14:00:00-04:00", "duration": 50}'
echo -e "\n"

# Test Case 8: Check Free Slots Again
echo "Test Case 8: Check Free Slots After More Events"
curl -X GET "$BASE_URL/slots?date=2023-09-30&timezone=US/Eastern"
echo -e "\n"

# Test Case 9: Try to Create an Event at 1:30 PM for 40 Minutes
echo "Test Case 9: Try to create Event at 1:30 PM for 40 Minutes"
curl -X POST "$BASE_URL/events" -H "Content-Type: application/json" -d '{"dateTime": "2023-09-30T13:30:00-04:00", "duration": 40}'
echo -e "\n"

echo "All tests executed."
