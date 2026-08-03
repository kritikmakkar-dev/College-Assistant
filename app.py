"""
==========================================
AI College Assistant
Flask Backend
==========================================
"""

# Import Flask functions
from flask import Flask, render_template, request, jsonify
from chatbot import get_bot_response
# Create Flask app
app = Flask(__name__)


# -------------------------------
# Home Page
# -------------------------------
@app.route("/")
def home():

    return render_template("index.html")


# -------------------------------
# Chat API
# -------------------------------
@app.route("/chat", methods=["POST"])
def chat():

    """
    This function receives a message
    from JavaScript and returns a reply.
    """

    # Read JSON sent by JavaScript
    data = request.get_json()

    # Get the user's message
    user_message = data.get("message")

    # Temporary reply
    bot_reply = get_bot_response(user_message)

    # Send response back as JSON
    return jsonify({
        "response": bot_reply
    })


# -------------------------------
# Run Server
# -------------------------------
if __name__ == "__main__":

    if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)