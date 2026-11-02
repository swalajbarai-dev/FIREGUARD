# FIREGUARD Dashboard

## 1. Install
Open Terminal in this folder and run:

    pip install flask

## 2. Start
Run:

    python app.py

Then open:

    http://127.0.0.1:5000

## 3. Test live sensor data
The dashboard refreshes every 2 seconds.

You can send ESP32/server data to:

    POST http://127.0.0.1:5000/api/data

Example JSON:

    {
      "temperature": 39.2,
      "humidity": 48,
      "smoke": 850,
      "latitude": 21.1458,
      "longitude": 79.0882,
      "fire": true
    }

## 4. Project data flow

ESP32 (DHT11 + MQ2 + GPS NEO-6M)
        |
       LoRa
        |
LoRa receiver / gateway
        |
Flask API
        |
FIREGUARD dashboard

## Important
This version is a dashboard + Flask API prototype. The ESP32/LoRa receiver must POST real sensor packets to /api/data for the values to become real.
