// This file contains the prototype function for the Connection
// object which will have methods that will interact with socketio
// and pass data back and forth from server

function Connection() {

    // this.joinGame = function(game_name, callback) {
    //
    //     var request = new XMLHttpRequest();
    //     request.onreadystatechange = function () {
    //         if (this.readyState === 4 && this.status === 200) {
    //             console.log("Got response text", this.responseText);
    //
    //         }
    //     };
    //
    //     request.open('POST', "api/game/new", true);
    //     request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //     request.send("name="+game_name);
    // };

    this.postChangeDir = function (game_name, playerID, new_direction) {

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log("Got Response text", this.responseText);
            }
        };

        request.open('POST', "api/game/changedir", true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("name="+game_name+"&playerID="+playerID+"&new_direction="+new_direction);
    };

    this.getGameState = function(game_name, playerID, callback) {

        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log("Got Response text", this.responseText);

                var responseObj = JSON.parse(this.responseText);
                if (responseObj.disconnected) {
                    callback(null, true);
                }
                console.log("Current game state: ");
                console.log(responseObj.game);
                callback(responseObj.game, false);
            }
        };

        request.open('GET', "api/game?name="+game_name+"&playerid="+playerID, true);
        request.send();
    };
}
