// This file contains the prototype function for the Connection
// object which will have methods that will interact with socketio
// and pass data back and forth from server

function Connection() {

    // EMITTER FUNCTIONS

    this.thisPlayerDidChangeDirection = function(playerID, newDirection) {
        socketio.emit('directionChangeFromClient', playerID, newDirection);
    };

    this.thisPlayerDidEnter = function(callback) { // Callback will be passed the playerID of this player
        socketio.on('newPlayerDidEnterFromClientResponse', callback);

        socketio.emit('newPlayerDidEnterFromClient');
    };

    // LISTENER FUNCTIONS

    this.setOtherPlayerDidChangeDirectionHandler = function(handler) {
        socketio.on('directionChangeFromServer', handler);
    };

    this.setNewPlayerDidEnterHandler = function(handler) {
        socketio.on('newPlayerDidEnterFromServer', handler);
    };
}
