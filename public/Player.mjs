let playerImg = new Image();
playerImg.src = "../assets/sans.png";

let playerTwo = new Image();
playerTwo.src = "../assets/sans-2.png";

class Player {
  constructor({
    x,
    y,
    score,
    id,
    drawing,
    chat,
    frame,
    showDialog = false,
    name,
    face,
  }) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.speed = 2;
    this.score = score || 0;
    this.id = id;
    this.chat = chat || "";
    this.showDialog = showDialog;
    this.movement = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
    this.frame = frame || 0;
    this.animation = {
      walking: {
        down: () => [
          35 * Math.floor(this.frame / 8),
          0,
          35,
          45,
          this.x - 18,
          this.y - 43,
          35,
          45,
        ],
        up: () => [
          154 + 35 * Math.floor(this.frame / 8),
          0,
          35,
          47,
          this.x - 18,
          this.y - 45,
          35,
          47,
        ],
        right: () => [
          26 * Math.floor(this.frame / 8),
          48,
          26,
          45,
          this.x - 13,
          this.y - 42,
          26,
          45,
        ],
        left: () => [
          25 * Math.floor(this.frame / 8),
          96,
          25,
          45,
          this.x - 13,
          this.y - 42,
          25,
          45,
        ],
      },
    };
    this.drawing = drawing || [
      35 * Math.floor(this.frame / 8),
      0,
      35,
      45,
      this.x - 18,
      this.y - 43,
      35,
      45,
    ];
  }

  draw(img, context, item, socket) {
    if (Object.values(this.movement).some(Boolean)) {
      for (let [dir, val] of Object.entries(this.movement)) {
        if (val) this.movePlayer(dir, this.speed);
        if (this.collision(item)) socket.emit("item-collected", item);
      }
      socket.emit("player-update", this);
    }

    context.drawImage(img, ...this.drawing);
    // context.fillStyle = '#ff0000';
    // context.fillRect(this.x - 5, this.y - 5, 10, 10);
  }

  movePlayer(dir, speed) {
    if (dir == "left") this.x -= this.x <= 17 ? 0 : speed;
    if (dir == "right") this.x += this.x >= 623 ? 0 : speed;
    if (dir == "up") this.y -= this.y <= 52 ? 0 : speed;
    if (dir == "down") this.y += this.y >= 426 ? 0 : speed;

    this.drawing = this.animation.walking[dir]();

    if (this.frame >= 31) this.frame = 0;
    else this.frame += 1;
  }
  // movePlayer(socket) {
  //     for(let [dir, val] of Object.entries(this.movement)) {
  //       if(val) {
  //         if(dir == 'left') this.x -= this.x <= 17 ? 0 : this.speed;
  //         if(dir == 'right') this.x += this.x >= 623 ? 0 : this.speed;
  //         if(dir == 'up') this.y -= this.y <= 52 ? 0 : this.speed;
  //         if(dir == 'down') this.y += this.y >= 426 ? 0 : this.speed;

  //         this.drawing = this.animation.walking[dir]();
  //       }
  //     }
  //     if(this.frame >= 31) this.frame = 0;
  //     else this.frame += 1;

  //     socket.emit('movement', this);
  //   }

  // collision(item) {
  //   return (
  //     this.x >= item.boundary[0] &&
  //     this.x <= item.boundary[1] &&
  //     this.y >= item.boundary[2] &&
  //     this.y <= item.boundary[3]
  //   );
  // }

  // calculateRank(arr) {
  //   //map to scores, remove duplicates, descending sort, indexOf, return rank
  //   let scores = arr.map((player) => player.score);
  //   scores = [...new Set(scores)].sort((a, b) => b - a);

  //   return `Rank: ${scores.indexOf(this.score) + 1}/${arr.length}`;
  // }
}

export default Player;
