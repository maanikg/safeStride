from flask import Flask, jsonify, request
from model import test

hazard = None

app = Flask(__name__)

text_data = "Hello from Flask!"


@app.route("/get-text", methods=["GET"])
def get_text():
    return jsonify({"text": text_data})


@app.route("/set-photo", methods=["POST"])
def set_photo():
    global text_data
    global hazard
    file = request.files["photo"]

    file_bytes = file.read()
    hazard = test.get_hazards(file_bytes)
    return jsonify({"message": "Photo updated successfully!", "hazard": hazard})


@app.route("/get-hazard", methods=["GET"])
def get_hazard():
    global hazard
    return jsonify({"hazard": hazard})


@app.route("/set-text", methods=["POST"])
def set_text():
    global text_data

    data = request.get_json()
    text_data = data.get("text", "")
    print(text_data)
    return jsonify({"message": "Text updated successfully!"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
