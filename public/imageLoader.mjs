export default function imgLoader(url) {
  const image = new Image();
  image.src = url;
  return image;
}
