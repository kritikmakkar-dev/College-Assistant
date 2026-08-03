"""
==========================================
AI College Assistant
chatbot.py
==========================================
"""

from google import genai
import os
from dotenv import load_dotenv
from google import genai

# New imports
import json
import os

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# -----------------------------
# Gemini Client
# -----------------------------
client = genai.Client(api_key=GEMINI_API_KEY)

# -----------------------------
# Load FAQ File
# -----------------------------

# Find the location of faq.json
FAQ_PATH = os.path.join("data", "faq.json")

# Open and read JSON file
with open(FAQ_PATH, "r") as file:

    faq_data = json.load(file)


# -----------------------------
# Search FAQ
# -----------------------------

def search_faq(user_message):

    """
    Checks whether the user's question
    exists inside the FAQ.
    """

    # Convert to lowercase
    question = user_message.lower()

    # Check every key
    for key in faq_data:

        if key in question:

            return faq_data[key]

    # Nothing found
    return None


# -----------------------------
# Gemini Response
# -----------------------------

def ask_gemini(user_message):

    prompt = f"""
You are an AI College Assistant.

Rules:

- Answer politely.

- Help students.

- Keep answers short.

Student Question:

{user_message}
"""

    response = client.models.generate_content(

        model="gemini-flash-latest",

        contents=prompt

    )

    return response.text


# -----------------------------
# Main Function
# -----------------------------

def get_bot_response(user_message):

    # Step 1
    # Search FAQ

    answer = search_faq(user_message)

    # If found...

    if answer:

        return answer

    # Otherwise use Gemini

    return ask_gemini(user_message)