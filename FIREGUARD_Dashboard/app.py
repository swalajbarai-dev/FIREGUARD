from flask import Flask, render_template, jsonify, request
from datetime import datetime

app = Flask(__name__)

latest_data = {
    "temperature": 38.5,
    "humidity": 62,
    "smoke": 724,
    "latitude": None,
    "longitude": None,
    "fire": False,
    "updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

@app.route("/")
def dashboard():
    return render_template("index.html")

@app.route("/api/data", methods=["GET"])
def get_data():
    return jsonify(latest_data)

@app.route("/api/data", methods=["POST"])
def set_data():
    global latest_data
    payload = request.get_json(silent=True) or {}

    if "temperature" in payload:
        latest_data["temperature"] = payload["temperature"]

    if "humidity" in payload:
        latest_data["humidity"] = payload["humidity"]

    if "mq2" in payload:
        latest_data["smoke"] = payload["mq2"]
    elif "smoke" in payload:
        latest_data["smoke"] = payload["smoke"]

    if payload.get("fix") is True:
        latest_data["latitude"] = payload.get("latitude", 0)
        latest_data["longitude"] = payload.get("longitude", 0)

    if "fire_status" in payload:
        latest_data["fire"] = payload["fire_status"] != "SAFE"
    elif "fire" in payload:
        latest_data["fire"] = payload["fire"]

    latest_data["updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return jsonify({"success": True, "data": latest_data})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)