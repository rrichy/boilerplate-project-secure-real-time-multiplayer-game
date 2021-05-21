class Collectible {
  constructor({x, y, value, id}) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.id = id;
    this.boundary = [x - 8, x + 8, y, y + 14];
  }

  draw(context, collectibleImg) {
    context.drawImage(collectibleImg, this.x - 16, this.y - 16);
    context.fillStyle = '#ff0000';
    context.fillRect(this.boundary[0], this.boundary[2], this.boundary[1] - this.boundary[0], this.boundary[3] - this.boundary[2]);
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
