class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = 0;
    this.id = id;
  }

  draw(context, mainPlayer=false) {
    if(mainPlayer) {
      context.fillStyle = '#6cd64f';
      context.fillRect(this.x, this.y, 5, 5);
    }
    else {
      context.fillStyle = '#b1641a';
      context.fillRect(this.x, this.y, 5, 5);
    }
  }

  movePlayer(dir, speed) {
    
  }

  keydown(e) {
    const {keyCode} = e;
    if(keyCode == 65 || keyCode == 37) {
        this.x -= 5;
    } //left
    if(keyCode == 68 || keyCode == 39) {
      this.x += 5;
    } //right
    if(keyCode == 87 || keyCode == 38) {
      this.y -= 5;
    } //up
    if(keyCode == 83 || keyCode == 40) {
      this.y += 5;
    } //down

    // console.log(e);
    // socket.emit('move', player);
  }

  collision(item) {

  }

  calculateRank(arr) {

  }
}

export default Player;
