export default function chatHandler(socket) {
  //   const messages = [];

  // Adding chat system to the game
  const form = document.getElementsByTagName("form")[0];
  const chatbox = document.getElementById("log");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const chatinput = document.getElementById("message");
    const message = chatinput.value;

    if (message === "") return;

    chatinput.value = "";

    // Emit chat
    renderChat([socket.id, message]);
    socket.emit("chat", { message });
  });

  socket.on("receive-chat", ({ message }) => {
    renderChat(message);
    // messages = [message].concat(messages.slice(0, 4));
  });

  //   for (let i = 0; i < messages.length; i++) {
  //     context.font = "12px Arial";
  //     context.fillStyle = "#ffffff";
  //     let text = messages[i][0] + ": " + messages[i][1];
  //     context.fillText(text, 40, 410 - i * 20);
  //   }

  function renderChat(message) {
    const list = document.createElement("li");
    list.innerText = message.join(": ");
    chatbox.appendChild(list);
    //   [...messages].reverse.forEach((message) => {
    //       const list = document.createElement('li');
    //       list.innerText(message.join(': '));
    //       chatbox.appendChild(list);
    //   });
  }

  // for(let i = 0; i < messages.length; i++) { // should only be showing latest chat of each player.... should fade after few seconds
  //     let chat = new Chat(messages[i][1]);
  //     let selected = playersList.find(player => player.id == messages[i][0]);
  //     if(selected) chat.draw(context, selected.x, selected.y);
  // }
}

// class Chat {
//   constructor(message) {
//     this.message = message;
//   }

//   draw(context, x, y, boxes) {
//     //boxes [stl, str, sbl, sbr, ltl, ltr, lbl, lbr]
//     const length = this.message.length;

//     if (length <= 22) {
//       // use small boxes
//       let message = this.message.match(/.{1,11}/g);
//       if (x <= 71) {
//         // use box with right orientation
//         if (y <= 121) {
//           // use box bot-right
//           context.drawImage(boxes[3], x - 14, y + 6);

//           for (let i = 0; i < message.length; i++) {
//             context.font = "12px Arial";
//             context.fillStyle = "#000000";
//             context.fillText(message[i], x - 8, y + 55 + i * 20);
//           }
//         } else {
//           // use top-right
//           context.drawImage(boxes[1], x - 14, y - 124);

//           for (let i = 0; i < message.length; i++) {
//             context.font = "12px Arial";
//             context.fillStyle = "#000000";
//             context.fillText(message[i], x - 8, y - 104 + i * 20);
//           }
//         }
//       } else {
//         // use box with left orientation
//         if (y <= 121) {
//           // use box bot-left
//           context.drawImage(boxes[2], x - 79, y + 7);

//           for (let i = 0; i < message.length; i++) {
//             context.font = "12px Arial";
//             context.fillStyle = "#000000";
//             context.fillText(message[i], x - 73, y + 55 + i * 20);
//           }
//         } else {
//           // use top-left
//           context.drawImage(boxes[0], x - 79, y - 125);

//           for (let i = 0; i < message.length; i++) {
//             context.font = "12px Arial";
//             context.fillStyle = "#000000";
//             context.fillText(message[i], x - 73, y - 104 + i * 20);
//           }
//         }
//       }
//     } else {
//       // use large boxes
//     }
//   }
// }

// export default Chat;
