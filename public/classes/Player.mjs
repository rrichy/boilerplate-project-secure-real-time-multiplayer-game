import imageLoader from "../imageLoader.mjs";

const faces = ["../assets/sans.png", "../assets/sans-2.png"].map(imageLoader);

class Player {
  constructor({
    id,
    name,
    x,
    y,
    speed,
    score = 0,
    face,
    orientation,
    drawing,
  }) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.score = score;
    this.face = faces[face - 1];
    this.orientation = orientation;

    this.movement = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    //     this.frame = 0;

    //     this.drawing = [
    //       35 * Math.floor(this.frame / 8),
    //       0,
    //       35,
    //       45,
    //       this.x - 18,
    //       this.y - 43,
    //       35,
    //       45,
    //     ];
  }

  movePlayer(dir) {
    if (dir == "left") this.x -= this.x <= 17 ? 0 : this.speed;
    if (dir == "right") this.x += this.x >= 623 ? 0 : this.speed;
    if (dir == "up") this.y -= this.y <= 52 ? 0 : this.speed;
    if (dir == "down") this.y += this.y >= 426 ? 0 : this.speed;

    //     console.log(`x: ${this.x}, y: ${this.y}`);
    //check for collect collision

    // this.drawing = this.animation.walking[dir]();

    // if (this.frame >= 31) this.frame = 0;
    // else this.frame += 1;
  }

  draw(context, socket) {
    for (let [dir, val] of Object.entries(this.movement)) {
      if (val) {
        this.movePlayer(dir);
        if (dir === "up" || dir === "down")
          this.orientation = [this.x - 18, this.y - 23, 35, 45];
        else this.orientation = [this.x - 13, this.y - 23, 26, 45];

        const { x, y, speed, score, orientation } = this;
        socket.emit("player-update", { x, y, speed, score, orientation });
      }
    }

    //     const image = this.face === 1 ? playerImg : playerTwo;
    //     console.log(this.face);    //
    //     context.drawImage(this.face, ...this.drawing);

    // if (Object.values(this.movement).some(Boolean)) {
    // for (let [dir, val] of Object.entries(this.movement)) {
    // if (val) this.movePlayer(dir, this.speed);
    // if (this.collision(item)) socket.emit("item-collected", item);
    // }
    // socket.emit("player-update", this);
    // }

    // context.drawImage(img, ...this.drawing);
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText(this.name, this.x, this.y - 45);

    context.fillStyle = "#ff0000";
    context.fillRect(...this.orientation);
    context.fillStyle = "#FFFFFF";

    context.fillRect(this.x, this.y, 1, 1);
  }
}

export default Player;
