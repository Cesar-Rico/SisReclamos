from flask import Flask, request
import requests
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)

@app.route("/wa")
def wa_hello():
    return "Hola Mundo"

@app.route("/wasms", methods=["POST"])
def wa_sms_reply():
    msg = request.form.get('Body').lower()

    print("msg-->", msg)
    resp = MessagingResponse()
    reply = resp.message()

    if msg == "quisiera registrar un reclamo":
        reply.body("Hola, cual es tu número de cliente?")
    
    return str(resp)
    
if __name__ == "__main__":
    app.run(debug=True)