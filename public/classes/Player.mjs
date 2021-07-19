import Characters from "./Characters.mjs";

class Player {
  constructor({ id, name, x, y, speed, score = 0, face, facing, frame }) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.score = score;
    this.character = Characters[face - 1]; //this
    this.facing = facing; // this

    this.movement = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    this.frame = frame;
  }

  movePlayer(dir) {
    if (dir == "left") this.x -= this.x <= 17 ? 0 : this.speed;
    if (dir == "right") this.x += this.x >= 599 ? 0 : this.speed;
    if (dir == "up") this.y -= this.y <= 14 ? 0 : this.speed;
    if (dir == "down") this.y += this.y >= 422 ? 0 : this.speed;

    //     console.log(`x: ${this.x}, y: ${this.y}`);
    //check for collect collision

    this.facing = dir;

    if (this.frame >= 31) this.frame = 0;
    else this.frame += 1;
  }

  draw(context, socket) {
    for (let [dir, val] of Object.entries(this.movement)) {
      if (val) {
        this.movePlayer(dir);
        // if (dir === "up" || dir === "down")
        // this.orientation = [this.x, this.y, 35, 45];
        //
        // else this.orientation = [this.x, this.y, 26, 45]; //

        const { x, y, speed, score, facing, frame } = this;
        socket.emit("player-update", { x, y, speed, score, facing, frame });
      }
    }

    // if (Object.values(this.movement).some(Boolean)) {
    // for (let [dir, val] of Object.entries(this.movement)) {
    // if (val) this.movePlayer(dir, this.speed);
    // if (this.collision(item)) socket.emit("item-collected", item);
    // }
    // socket.emit("player-update", this);
    // }

    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText(this.name, this.x + this.character[0][1] / 2, this.y - 10);

    // context.fillStyle = "#ff0000";
    // context.fillRect(...this.orientation);
    context.fillStyle = "#FFFFFF";

    context.fillRect(this.x, this.y, 1, 1);

    context.drawImage(
      this.character[0][0],
      ...this.character[1][this.facing](this.x, this.y, this.frame)
    );
  }
}

export default Player;
