module.exports = {
    
    name: 'roll',
    alias: ['d20'],
    description: 'Lanza un dado y ve que te sale.',
    
    async execute(message, args, commandName) {

        let rotation = 8;
        let x = 107;
        let y = 110;

        //Required Canvas and path instances.
        const Canvas = require('canvas');
        const Discord = require('discord.js');
        const path = require('path');

        r20 = function (limit) {

            this.limit = limit;
            let roll = Math.floor((Math.random() * limit) + 1);
            return roll;

        }

        //Loading the background dice image and resolving the path.
        const bg = await Canvas.loadImage(path.resolve('./assets/dice.png'));

        //Canvas declaration
        const cdef = Canvas.createCanvas(200, 200);

        //Context declaration
        let ctx = cdef.getContext('2d');
        ctx.drawImage(bg, 0, 0, cdef.width, cdef.height);

        if (commandName == 'd20') {

            //Result display
            ctx.font = '58px serif';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.rotate(rotation * Math.PI / 180);
            ctx.fillText(`${r20(20)}`, x, y);

        }

        else if (commandName == 'roll') {

            if (!args.length) {
                return message.reply ("debes introducir el numero máximo para lanzar el dado.");
            }
            
            //Result display
            ctx.font = '58px serif';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.rotate(rotation * Math.PI / 180);
            ctx.fillText(`${r20(args[0].toLowerCase())}`, x, y);

        }

        let attachement = new Discord.Attachment(cdef.toBuffer(), 'd20.png');
        message.channel.send(attachement);
    },
}