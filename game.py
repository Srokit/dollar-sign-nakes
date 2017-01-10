# The game logic for the multiplayer $nakes game. Up to four players!

import random, math, time

# Global settings
BLOCK_SIZE = 20
TIME_TILL_PLAYER_DISCONNECT = 2 # 2 seconds
SCREEN_DIMENSIONS = {
    'w': 1000,
    'h': 800
}
STARTING_SNAKE_SIZE = 3

BLACK = '#000000'
GREEN = '#00FF00'
GOLD = '#FFFF00'
GRAY = '#999999'



class Block:

    def __init__(self, pos_x, pos_y):
        self.pos = {
            'x': pos_x,
            'y': pos_y
        }
        self.color = BLACK


class BodySegment(Block):

    def __init__(self, pos_x, pos_y):
        Block.__init__(self, pos_x, pos_y)
        self.color = GREEN


class GoldPiece(Block):

    def __init__(self):

        # Get random x and y position (in one block to account for walls)
        pos_x = random.choice(range(BLOCK_SIZE, SCREEN_DIMENSIONS['w'] - BLOCK_SIZE, BLOCK_SIZE))
        pos_y = random.choice(range(BLOCK_SIZE, SCREEN_DIMENSIONS['h'] - BLOCK_SIZE, BLOCK_SIZE))

        Block.__init__(self, pos_x, pos_y)

        self.color = GOLD


class WallSegment(Block):

    def __init__(self, pos_x, posy_y):
        Block.__init__(pos_x, posy_y)
        self.color = GRAY


class Snake:

    def __init__(self):
        centering_x = math.floor(SCREEN_DIMENSIONS['w'] / BLOCK_SIZE / 2) * BLOCK_SIZE
        centering_y = math.floor(SCREEN_DIMENSIONS['h'] / BLOCK_SIZE / 2) * BLOCK_SIZE
        # Make starting segments
        self.segments = [BodySegment(centering_x - BLOCK_SIZE * i, centering_y) for i in range(STARTING_SNAKE_SIZE)]

        self.direction = 'right'

    def move(self):

        for i in range(len(self.segments) - 1, 0, -1):
            self.segments[i].pos['x'] = self.segments[i-1].pos['x']
            self.segments[i].pos['y'] = self.segments[i-1].pos['y']

        if self.direction == 'right':
            self.segments[0].pos['x'] += BLOCK_SIZE
        elif self.direction == 'left':
            self.segments[0].pos['x'] -= BLOCK_SIZE
        elif self.direction == 'up':
            self.segments[0].pos['y'] -= BLOCK_SIZE
        else: # elif self.direction == 'down':
            self.segments[0].pos['y'] += BLOCK_SIZE

    def change_dir(self, new_direction):
        if self.direction == 'right' and new_direction == 'left':
            return
        elif self.direction == 'left' and new_direction == 'right':
            return
        elif self.direction == 'up' and new_direction == 'down':
            return
        elif self.direction == 'down' and new_direction == 'up':
            return
        self.direction = new_direction


class Wall:

    def __init__(self):
        self.segments = []

        for x in range(0, SCREEN_DIMENSIONS['w'], BLOCK_SIZE):
            self.segments.append(WallSegment(x, 0))
            self.segments.append(WallSegment(x, SCREEN_DIMENSIONS['h'] - BLOCK_SIZE))

        for y in range(0, SCREEN_DIMENSIONS['h'], BLOCK_SIZE):
            self.segments.append(WallSegment(0, y))
            self.segments.append(WallSegment(SCREEN_DIMENSIONS['w'] - BLOCK_SIZE, y))


class Player:

    def __init__(self):

        self.snake = Snake()
        self.time_since_last_request = time.time()

    def move(self):
        self.snake.move()

    def change_dir(self, new_direction):
        self.snake.change_dir(new_direction)


class Game:

    def __init__(self):
        self.players = {} # Game starts with 1 player
        self.gold_piece = GoldPiece()

        self.requests_since_move = 0

    def handle_request(self, thisPlayerID):

        print "in handle request"

        self.requests_since_move += 1

        for playerID in self.players:
            print time.time() - self.players[playerID].time_since_last_request
            if (time.time() - self.players[playerID].time_since_last_request) > TIME_TILL_PLAYER_DISCONNECT:
                self.disconnect_player(playerID)
                if playerID == thisPlayerID:
                    return False
        self.players[thisPlayerID].time_since_last_request = time.time()


        print len(self.players)
        print self.requests_since_move

        if self.requests_since_move >= 4:
            print "Move in game object"
            self.move()
            if self.check_competing_player_collision():
                self.disconnect_player(thisPlayerID)
                return False
            self.requests_since_move = 0
        return True

    def move(self):

        for key in self.players:
            self.players[key].move()

    def change_dir(self, player_id, new_direction):

        self.players[player_id].change_dir(new_direction)

    def disconnect_player(self, player_id):

        del self.players[player_id]

    def add_player(self):

        if len(self.players) == 4:
            return
        player_id = "1"
        for i in ["1", "2", "3", "4"]:
            if i not in self.players:
                self.players[i] = Player()
                player_id = i
                break

        return player_id

    def check_competing_player_collision(self):

        for playerID1 in self.players:

            for playerID2 in self.players:

                if playerID1 == playerID2:
                    break

                for ply_2_seg in self.players[playerID2].segments:

                    if self.players[playerID1].snake.segments[0].pos.x == ply_2_seg.pos.x and \
                                    self.players[playerID1].snake.segments[0].pos.y == ply_2_seg.pos.y:
                        print "Collision"
                        return True
        return False
