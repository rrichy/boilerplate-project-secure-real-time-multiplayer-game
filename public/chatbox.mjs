class Chat {
    constructor(message) {
        this.message = message;
    }

    draw(context, x, y) {
        const length = this.message.length;
        console.log('drawing dialog box', length);
        console.log(context);
        console.log(x, y);
        
        if(length <= 22) { // use small boxes
            let message = this.message.match(/.{1,11}/g);
            if(x <= 71) { // use box with right orientation
                if(y <= 121) { // use box bot-right
                    let box = new Image();
                    box.src = '../assets/chatbox/chat-s-br.png';
                    context.drawImage(box, x - 14, y + 6);

                    for(let i = 0; i < message.length; i++) {
                        context.font = '12px Arial';
                        context.fillStyle = '#000000';
                        context.fillText(message[i], x - 8, y + 55 + i * 20);
                    }
                }
                else { // use top-right
                    let box = new Image();
                    box.src = '../assets/chatbox/chat-s-tr.png';
                    context.drawImage(box, x - 14, y - 124);

                    for(let i = 0; i < message.length; i++) {
                        context.font = '12px Arial';
                        context.fillStyle = '#000000';
                        context.fillText(message[i], x - 8, y - 104 + i * 20);
                    }
                }
            }
            else { // use box with left orientation
                if(y <= 121) { // use box bot-left
                    let box = new Image();
                    box.src = '../assets/chatbox/chat-s-bl.png';
                    context.drawImage(box, x - 79, y + 7);

                    for(let i = 0; i < message.length; i++) {
                        context.font = '12px Arial';
                        context.fillStyle = '#000000';
                        context.fillText(message[i], x - 73, y + 55 + i * 20);
                    }
                }
                else { // use top-left
                    let box = new Image();
                    box.src = '../assets/chatbox/chat-s-tl.png';
                    context.drawImage(box, x - 79, y - 125);

                    for(let i = 0; i < message.length; i++) {
                        context.font = '12px Arial';
                        context.fillStyle = '#000000';
                        context.fillText(message[i], x - 73, y - 104 + i * 20);
                    }
                }
            }

        }
        else { // use large boxes

        }

    }
}

export default Chat;