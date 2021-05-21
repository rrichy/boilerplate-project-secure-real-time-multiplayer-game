class Player {
  constructor({x, y, score, id, drawing, frame}) {
    this.x = x;
    this.y = y;
    this.speed = 2;
    this.score = score || 0;
    this.id = id;
    this.movement = {
      'left': false,
      'right': false,
      'up': false,
      'down': false
    };
    this.frame = frame || 0;
    this.animation = {
      walking: {
        'down': () => [35 * Math.floor(this.frame / 8), 0, 35, 45, this.x - 18, this.y - 43, 35, 45],
        'up': () => [154 + 35 * Math.floor(this.frame / 8), 0, 35, 47, this.x - 18, this.y - 45, 35, 47],
        'right': () => [26 * Math.floor(this.frame / 8), 48, 26, 45, this.x - 13, this.y - 42, 26, 45],
        'left': () => [25 * Math.floor(this.frame / 8), 96, 25, 45, this.x - 13, this.y - 42, 25, 45]
      }
    }
    this.drawing = drawing || [35 * Math.floor(this.frame / 8), 0, 35, 45, this.x - 18, this.y - 43, 35, 45];
  }

  draw(img, context, socket) {
    // console.log(this.drawing);
    if(socket && Object.values(this.movement).some(Boolean)) this.movePlayer(socket);

    context.drawImage(img, ...this.drawing);
    context.fillStyle = '#ff0000';
    context.fillRect(this.x - 5, this.y - 5, 10, 10);
  }

  movePlayer(socket) {
    // while(Object.values(this.movement).some(Boolean)){
      // console.log(Object.values(this.movement).some(Boolean));
      for(let [dir, val] of Object.entries(this.movement)) {
        if(val) {
          if(dir == 'left') this.x -= this.speed;
          if(dir == 'right') this.x += this.speed;
          if(dir == 'up') this.y -= this.speed;
          if(dir == 'down') this.y += this.speed;

          this.drawing = this.animation.walking[dir]();
        }
      }
      if(this.frame >= 31) this.frame = 0;
      else this.frame += 1;

      socket.emit('movement', this);
    }
  // }

  collision(item, socket) {
    if(this.x >= item.boundary[0] && this.x <= item.boundary[1] && this.y >= item.boundary[2] && this.y <= item.boundary[3]) {
      socket.emit('item-collected', item);
    }
  }

  calculateRank(arr) {

  }
}

export default Player;
