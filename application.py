import time
import flask
from flask_socketio import SocketIO, emit

# Global settings
PORT = 3000

# Main flask application object
app = flask.Flask(__name__)

# SocketIO will handle the game socket data
socketio = SocketIO(app)

#### START ROUTES

# GET /
@app.route('/', methods=['GET'])
def home():
    return flask.render_template('index.html')

# GET /app
@app.route('/game', methods=['GET'])
def get_game():
    return flask.render_template('game.html', canvas_width="1000", canvas_height="700")

#### END ROUTES

#### START SOCKET EVENTS

@socketio.on("connect")
def on_connect():
    print "Got data from 'connect' event."

@socketio.on("Hello")
def on_Hello(ack):
    print "Got Hello event from client side!"
    print ack

    emit('Hi', "This was the ack")

#### END SOCKET EVENTS

def printStartMess(port):
    print "Starting flask server on port " + str(port)

if __name__ == '__main__':
    printStartMess(PORT);

    #Start SocketIO listening
    socketio.run(app, port=PORT)