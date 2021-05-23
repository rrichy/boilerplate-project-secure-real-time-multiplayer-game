class Chat {
    constructor(message) {
        this.message = message;
    }

    draw(context, x, y, boxes) { //boxes [stl, str, sbl, sbr, ltl, ltr, lbl, lbr]
        const length = this.message.length;
        
        if(length <= 22) { // use small boxes
            let message = this.message.match(/.{1,11}/g);
            if(x <= 71) { // use box with right orientation
                if(y <= 121) { // use box bot-right
                    context.drawImage(boxes[3], x - 14, y + 6);

                    for(let i = 0; i < message.length; i++) {
                        context.font = '12px Arial';
                        context.fillStyle = '#000000';
                        context.fillText(message[i], x - 8, y + 55 + i * 20);
                    }
                }
                else { // use top-right
                    context.drawImage(boxes[1], x - 14, y - 124);

                    for(let i = 0; i < message.length; i++) {
                        context.font = '12px Arial';
                        context.fillStyle = '#000000';
                        context.fillText(message[i], x - 8, y - 104 + i * 20);
                    }
                }
            }
            else { // use box with left orientation
                if(y <= 121) { // use box bot-left
                    context.drawImage(boxes[2], x - 79, y + 7);

                    for(let i = 0; i < message.length; i++) {
                        context.font = '12px Arial';
                        context.fillStyle = '#000000';
                        context.fillText(message[i], x - 73, y + 55 + i * 20);
                    }
                }
                else { // use top-left
                    context.drawImage(boxes[0], x - 79, y - 125);

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