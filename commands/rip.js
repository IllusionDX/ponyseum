module.exports = {
    
    name: 'rip',
    description: 'Aquí yacen mis esperanzas y sueños.',
    usage: '@usuario [texto en la lapida]',
    
    async execute(message, args) {
        
        const Canvas = require('canvas');
        const Discord = require('discord.js');
        const path = require('path');

        let x = 145;
        let y = 215;

        let tX = 150;
        let tY = 245;
        let tMaxWidth = 150;

        getLines = function (text, ctx, maxWidth) {

            this.text = text;
            text.shift();

            let words = text.join(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                let word = words[i];
                let width = ctx.measureText(currentLine + "" + word).width;
                if (width < maxWidth) {
                    currentLine += "" + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        
        }

        //Loading the background dice image and resolving the path.
        const bg = await Canvas.loadImage(path.resolve('./assets/rip.png'));

        //Canvas declaration
        const cdef = Canvas.createCanvas(400, 400);
        
        //Context declaration
        let ctx = cdef.getContext('2d');
        ctx.drawImage(bg, 0, 0, cdef.width, cdef.height);

        if (!args.length) {

            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(`@${message.author.username}`, x, y);
        }
        
        else if (args[0] = message.mentions.users.first()) {

            ctx.font = 'bold 18px sans-serif';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(`@${message.mentions.users.first().username}`, x, y, 145);
            
            if (args[1]) {

                ctx.font = 'bold 16px sans-serif';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                
                let lines = getLines(args, ctx, tMaxWidth);

                for (let i = 0; i < lines.length; i++) {
                    ctx.fillText(lines[i], tX, tY, tMaxWidth);
                    tY += 15;
                }
            }
        }

        else {
            return message.channel.send("Argumentos inválidos.");
        }
        
        //Declaring and sending attachment
        let attachement = new Discord.Attachment(cdef.toBuffer(), 'd20.png');
        message.channel.send(attachement);
    },
}