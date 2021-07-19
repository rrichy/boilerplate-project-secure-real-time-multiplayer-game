import imageLoader from "../imageLoader.mjs";

const Faces = ["../assets/sans.png", "../assets/sans-2.png"].map((pic) => [
  imageLoader(pic),
  35,
]); // image, charWidth

const DrawCuts = [
  {
    down: (x, y, frame) => [
      35 * Math.floor(frame / 8),
      0,
      35,
      45,
      x,
      y,
      35,
      45,
    ], // front
    up: (x, y, frame) => [
      154 + 35 * Math.floor(frame / 8),
      0,
      35,
      45,
      x,
      y,
      35,
      45,
    ], // back
    right: (x, y, frame) => [
      35 * Math.floor(frame / 8),
      48,
      35,
      45,
      x,
      y,
      35,
      45,
    ], // right
    left: (x, y, frame) => [
      35 * Math.floor(frame / 8),
      96,
      35,
      45,
      x,
      y,
      35,
      45,
    ], // left
  },
  {
    down: (x, y, frame) => [
      35 * Math.floor(frame / 8),
      0,
      35,
      45,
      x,
      y,
      35,
      45,
    ], // front
    up: (x, y, frame) => [
      154 + 35 * Math.floor(frame / 8),
      0,
      35,
      45,
      x,
      y,
      35,
      45,
    ], // back
    right: (x, y, frame) => [
      35 * Math.floor(frame / 8),
      48,
      35,
      45,
      x,
      y,
      35,
      45,
    ], // right
    left: (x, y, frame) => [
      35 * Math.floor(frame / 8),
      96,
      35,
      45,
      x,
      y,
      35,
      45,
    ], // left
  },
];

const Characters = Faces.map((face, index) => [face, DrawCuts[index]]);

export default Characters;
