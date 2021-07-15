export default (mainPlayer) => {
  document.onkeydown = (e) => {
    let active = document.activeElement;
    const { code } = e;
    console.log(code);
    if (active.id !== "message") {
      if (code === "KeyA") mainPlayer.movement["left"] = true;
      if (code === "KeyD") mainPlayer.movement["right"] = true;
      if (code === "KeyW") mainPlayer.movement["up"] = true;
      if (code === "KeyS") mainPlayer.movement["down"] = true;
      if (code === "Enter") document.getElementById("message").focus();
    }
  };

  document.onkeyup = (e) => {
    let active = document.activeElement;
    const { code } = e;

    if (active.id !== "message") {
      if (code === "KeyA") mainPlayer.movement["left"] = false;
      if (code === "KeyD") mainPlayer.movement["right"] = false;
      if (code === "KeyW") mainPlayer.movement["up"] = false;
      if (code === "KeyS") mainPlayer.movement["down"] = false;
      // console.log(mainPlayer.x, mainPlayer.y);
    }
  };
};
