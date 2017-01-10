import flask
import time

import game

# Global settings
PORT = 3000
STEPS_PER_SEC = 30


# Main flask application object
application = flask.Flask(__name__)

# Game objects by game name
games = {}

def dict_from_game_object(game_obj):
    game_dict = {
        'players': {},
        'goldPiece': {
            'pos': {
                'x': game_obj.gold_piece.pos['x'],
                'y': game_obj.gold_piece.pos['y']
            }
        }
    }

    for player_id in game_obj.players:
        player = game_obj.players[player_id]
        game_dict['players'][player_id] = {
            'snake': {
                'segments': []
            }
        }
        for segment in player.snake.segments:
            game_dict['players'][player_id]['snake']['segments'].append({
                'pos': {
                    'x': segment.pos['x'],
                    'y': segment.pos['y']
                }
            })
    return game_dict

# START ROUTES

@application.route('/', methods=['GET'])
def get_root():
    return flask.render_template('index.html', games=games.keys())

@application.route('/game', methods=['GET'])
def get_game():
    game_name = flask.request.args['name']
    player_id = flask.request.args['playerid']
    return flask.render_template('game.html', canvas_width=1000, canvas_height=800,
                                 game_name=game_name, player_id=player_id)


@application.route('/api/game/new', methods=['POST'])
def post_game_new():

    game_name = flask.request.form['name']
    games[game_name] = game.Game()

    return flask.redirect('/api/game/join?name='+game_name)

@application.route('/api/game', methods=['GET'])
def get_game_state():
    game_name = flask.request.args['name']
    playerID = flask.request.args['playerid']
    game = games[game_name]
    if not game.handle_request(playerID):
        return flask.jsonify({'disconnected': True})

    return flask.jsonify({'game': dict_from_game_object(game)})

@application.route('/api/game/changedir', methods=['POST'])
def post_game_changedir():
    game_name = flask.request.form['name']
    new_direction = flask.request.form['new_direction']
    playerID = flask.request.form['playerID']
    game = games[game_name]
    game.change_dir(playerID, new_direction)
    return flask.jsonify({'success': True})

@application.route('/api/game/join', methods=['GET'])
def get_game_join():
    game_name = flask.request.args['name']
    game = games[game_name]
    player_id = game.add_player()

    return flask.redirect('/game?name='+game_name+'&playerid='+player_id)


def printStartMess(port):
    print "Starting flask server on port " + str(port)


if __name__ == '__main__':
    printStartMess(PORT)
    application.run(port=PORT)


# Helpers



