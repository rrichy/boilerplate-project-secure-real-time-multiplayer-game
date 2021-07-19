// Adding chat system to the game

// For the static chatbox on the lowerleft of the screen
export function chatHandler(socket, main, players, fps) {
  const form = document.getElementsByTagName("form")[0];
  const chatbox = document.getElementById("log");
  let { name } = main;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // const active = document.activeElement;
    const chatinput = document.getElementById("message");
    const message = chatinput.value;

    if (message === "") {
      document.activeElement.blur();
      return;
    }

    chatinput.value = "";

    // Chat commands
    if (/^\/setname .+/.test(message)) {
      name = message.match(/(?:^\/setname )(.+)/)[1];
      main.name = name;
      socket.emit("change-name", { name });
    } else {
      // Emit chat
      renderChat([name, message], main);
      // renderDialog()
      socket.emit("chat", { message });
    }
    // Focus back to canvas/htmlbody
    document.activeElement.blur();
    const log = document.getElementById("log");
    log.scrollTop = log.scrollHeight;
  });

  socket.on("receive-chat", ({ message, id }) => {
    // console.log(message);
    const player = players.find((player) => player.id === id);
    renderChat(message, player);
  });

  socket.on("announce", ({ message }) => {
    renderChat(message);
  });

  //   for (let i = 0; i < messages.length; i++) {
  //     context.font = "12px Arial";
  //     context.fillStyle = "#ffffff";
  //     let text = messages[i][0] + ": " + messages[i][1];
  //     context.fillText(text, 40, 410 - i * 20);
  //   }

  const box = document.createElement("p");
  box.className = "dialog";

  let dialogBoxRender, destroyBox;

  function renderChat(message, player) {
    const list = document.createElement("li");
    list.innerText = message.join(": ");
    chatbox.appendChild(list);

    if (player) {
      const container = document.querySelector(".container");
      const canvas = document.getElementById("game-window");
      const offsetX = canvas.offsetLeft;
      const offsetY = canvas.offsetTop;

      clearTimeout(destroyBox);
      clearInterval(dialogBoxRender);
      box.remove();
      box.innerText = message[1];

      container.appendChild(box);

      const boxWidth = box.offsetWidth;
      const boxHeight = box.offsetHeight;

      dialogBoxRender = setInterval(() => {
        const { x: charX, y: charY, character } = player;

        const offset = character[0][1];

        box.style.left = `${
          offsetX + charX - Math.floor((boxWidth - offset) / 2)
        }px`;
        box.style.top = `${offsetY + charY - boxHeight - 45}px`;
      }, 1000 / fps);

      destroyBox = setTimeout(() => {
        clearInterval(dialogBoxRender);
        box.remove();
      }, 7000);
    }
  }

  // for(let i = 0; i < messages.length; i++) { // should only be showing latest chat of each player.... should fade after few seconds
  //     let chat = new Chat(messages[i][1]);
  //     let selected = playersList.find(player => player.id == messages[i][0]);
  //     if(selected) chat.draw(context, selected.x, selected.y);
  // }
}

export class Chat {
  constructor(message) {
    this.message = message;
  }

  draw(context, x, y, boxes) {
    //boxes [stl, str, sbl, sbr, ltl, ltr, lbl, lbr]
    const length = this.message.length;

    if (length <= 22) {
      // use small boxes
      let message = this.message.match(/.{1,11}/g);
      if (x <= 71) {
        // use box with right orientation
        if (y <= 121) {
          // use box bot-right
          context.drawImage(boxes[3], x - 14, y + 6);

          for (let i = 0; i < message.length; i++) {
            context.font = "12px Arial";
            context.fillStyle = "#000000";
            context.fillText(message[i], x - 8, y + 55 + i * 20);
          }
        } else {
          // use top-right
          context.drawImage(boxes[1], x - 14, y - 124);

          for (let i = 0; i < message.length; i++) {
            context.font = "12px Arial";
            context.fillStyle = "#000000";
            context.fillText(message[i], x - 8, y - 104 + i * 20);
          }
        }
      } else {
        // use box with left orientation
        if (y <= 121) {
          // use box bot-left
          context.drawImage(boxes[2], x - 79, y + 7);

          for (let i = 0; i < message.length; i++) {
            context.font = "12px Arial";
            context.fillStyle = "#000000";
            context.fillText(message[i], x - 73, y + 55 + i * 20);
          }
        } else {
          // use top-left
          context.drawImage(boxes[0], x - 79, y - 125);

          for (let i = 0; i < message.length; i++) {
            context.font = "12px Arial";
            context.fillStyle = "#000000";
            context.fillText(message[i], x - 73, y - 104 + i * 20);
          }
        }
      }
    } else {
      // use large boxes
    }
  }
}
