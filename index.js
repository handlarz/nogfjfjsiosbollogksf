const { Client, Intents, MessageAttachment } = require('discord.js');
require('dotenv').config();
const { createCanvas, loadImage } = require('canvas');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
  ],
});

client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
  client.user.setActivity('c!help', { type: 'LISTENING' });
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('c!apture-self')) {
    if (message.content.length >= 16) {
      const textToCapture = `"${message.content.slice(14)}"`; // Remove the "c!apture-self " part
      const canvas = createCanvas(720, 480); // Larger canvas size
      const ctx = canvas.getContext('2d');

      // Draw black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load user's avatar, make it round and monochromatic
      const userAvatar = await loadImage(message.author.displayAvatarURL({ format: 'png', size: 128 }));
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width - 64, canvas.height - 64, 64, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Convert avatar to grayscale
      ctx.drawImage(userAvatar, canvas.width - 128, canvas.height - 128, 128, 128);
      ctx.globalCompositeOperation = 'saturation';
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#FFF");
      grad.addColorStop(1, "#000");
      ctx.fillStyle = grad;
      ctx.fillRect(canvas.width - 128, canvas.height - 128, 128, 128);

      ctx.restore();

      // Draw white text with larger Times New Roman font
      ctx.fillStyle = '#ffffff';
      ctx.font = '26px "Times New Roman"'; // Larger font size
      const lines = textToCapture.match(/.{1,40}/g); // Split text into lines
      lines.forEach((line, index) => {
        ctx.fillText(line, 40, 70 + index * 40); // Adjust positioning for larger canvas and font
      });

      // Add user's name as a signature in the right bottom corner
      ctx.font = '36px "Times New Roman"';
      const usernameWidth = ctx.measureText(`-${message.author.username}`).width;
      ctx.fillText(`-${message.author.username}`, canvas.width - usernameWidth - 250, canvas.height - 40);

      const attachment = new MessageAttachment(canvas.toBuffer(), 'capture.png');
      message.reply({ files: [attachment] });
    } else if (message.content.length <= 15) {
      message.reply("please define text to capture.");
    }
  }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
  
    if (message.content.startsWith("c!apture")) {
        if (message.content) {
            const repliedMessage = message.reference
            ? await message.channel.messages.fetch(message.reference.messageId)
            : null;
            if (repliedMessage) {
                const textToCapture = `"`+repliedMessage.content+`"`
                const canvas = createCanvas(720, 480); // Larger canvas size
                const ctx = canvas.getContext('2d');

                // Draw black background
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Load user's avatar, make it round and monochromatic
                const userAvatar = await loadImage(repliedMessage.author.displayAvatarURL({ format: 'png', size: 128 }));
                ctx.save();
                ctx.beginPath();
                ctx.arc(canvas.width - 64, canvas.height - 64, 64, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                
                // Convert avatar to grayscale
                ctx.drawImage(userAvatar, canvas.width - 128, canvas.height - 128, 128, 128);
                ctx.globalCompositeOperation = 'saturation';
                const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                grad.addColorStop(0, "#FFF");
                grad.addColorStop(1, "#000");
                ctx.fillStyle = grad;
                ctx.fillRect(canvas.width - 128, canvas.height - 128, 128, 128);

                ctx.restore();

                // Draw white text with larger Times New Roman font
                ctx.fillStyle = '#ffffff';
                ctx.font = '26px "Times New Roman"'; // Larger font size
                const lines = textToCapture.match(/.{1,40}/g); // Split text into lines
                if (lines) {
                    lines.forEach((line, index) => {
                        ctx.fillText(line, 40, 70 + index * 40); // Adjust positioning for larger canvas and font
                    });

                    // Add user's name as a signature in the right bottom corner
                    ctx.font = '36px "Times New Roman"';
                    const usernameWidth = ctx.measureText(`-${repliedMessage.author.username}`).width;
                    ctx.fillText(`-${repliedMessage.author.username}`, canvas.width - usernameWidth - 250, canvas.height - 40);

                    const attachment = new MessageAttachment(canvas.toBuffer(), 'capture.png');
                    message.reply({ files: [attachment] });
                } else {
                    message.channel.send("you can't frame media.");
                }
            } else {
                message.channel.send(`There was an error, perhaps you didn't reply to any message.`);
            }
        }
    }
});

client.on("messageCreate", async message => {
    if(message.content === "c!help"){
        await message.reply({
            embeds: [{
              author: {
                name: "CAPTURE BOT'S COMMAND LIST"
              },
              fields: [
                {
                  name: "c!apture",
                  value: "captures message that you have replied to while using the command",
                  inline: true
                },
                {
                  name: "c!apture-self",
                  value: "captures your message specified in command (c!apture-self your message)",
                  inline: true
                }
              ],
              color: "#00b0f4",
              footer: {
                text: "capture bot"
              },
              timestamp: 1692113411641
            }]
          });
    }
})

client.login(token);
