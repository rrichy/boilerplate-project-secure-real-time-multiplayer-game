import imageLoader from "../imageLoader.mjs";

// const Faces = ["../assets/sans.png", "../assets/sans-2.png"].map((pic) => [
//   imageLoader(pic),
//   35,
// ]); // image, charWidth

// const DrawCuts = [
//   {
//     down: (x, y, frame) => [
//       35 * Math.floor(frame / 8),
//       0,
//       35,
//       45,
//       x,
//       y,
//       35,
//       45,
//     ], // front
//     up: (x, y, frame) => [
//       154 + 35 * Math.floor(frame / 8),
//       0,
//       35,
//       45,
//       x,
//       y,
//       35,
//       45,
//     ], // back
//     right: (x, y, frame) => [
//       35 * Math.floor(frame / 8),
//       48,
//       35,
//       45,
//       x,
//       y,
//       35,
//       45,
//     ], // right
//     left: (x, y, frame) => [
//       35 * Math.floor(frame / 8),
//       96,
//       35,
//       45,
//       x,
//       y,
//       35,
//       45,
//     ], // left
//   },
//   {
//     down: (x, y, frame) => [
//       35 * Math.floor(frame / 8),
//       0,
//       35,
//       45,
//       x,
//       y,
//       35,
//       45,
//     ], // front
//     up: (x, y, frame) => [
//       154 + 35 * Math.floor(frame / 8),
//       0,
//       35,
//       45,
//       x,
//       y,
//       35,
//       45,
//     ], // back
//     right: (x, y, frame) => [
//       35 * Math.floor(frame / 8),
//       48,
//       35,
//       45,
//       x,
//       y,
//       35,
//       45,
//     ], // right
//     left: (x, y, frame) => [
//       35 * Math.floor(frame / 8),
//       96,
//       35,
//       45,
//       x,
//       y,
//       35,
//       45,
//     ], // left
//   },
// ];

export const Faces = Array(25)
  .fill("")
  .map((_, i) => imageLoader(`../assets/sprites/${i + 1}.png`)); // image, charWidth

export const DrawCuts = {
  down: (x, y, frame) => [
    14 + 48 * Math.floor(frame / 8),
    19,
    21,
    46,
    x,
    y,
    21,
    46,
  ], // front
  up: (x, y, frame) => [
    14 + 48 * Math.floor(frame / 8),
    211,
    21,
    46,
    x,
    y,
    21,
    46,
  ], // back
  right: (x, y, frame) => [
    15 + 48 * Math.floor(frame / 8),
    148,
    21,
    45,
    x,
    y,
    21,
    45,
  ], // right
  left: (x, y, frame) => [
    14 + 48 * Math.floor(frame / 8),
    84,
    21,
    45,
    x,
    y,
    21,
    45,
  ], // left
};

export const DrawCuts4 = {
  down: (x, y, frame) => [
    20 + 65 * Math.floor(frame / 8),
    19,
    25,
    46,
    x,
    y,
    25,
    46,
  ], // front
  up: (x, y, frame) => [
    20 + 65 * Math.floor(frame / 8),
    211,
    25,
    46,
    x,
    y,
    25,
    46,
  ], // back
  right: (x, y, frame) => [
    22 + 65 * Math.floor(frame / 8),
    148,
    24,
    45,
    x,
    y,
    24,
    45,
  ], // right
  left: (x, y, frame) => [
    20 + 65 * Math.floor(frame / 8),
    84,
    24,
    45,
    x,
    y,
    24,
    45,
  ], // left
};

// const Characters = Faces.map((face, index) => [face, DrawCuts[index]]);

// export default Characters;
