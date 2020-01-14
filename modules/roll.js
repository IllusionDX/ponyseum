const Canvas = require("canvas")
const Discord = require("discord.js")
const path = require("path")

module.exports = {

    name: "roll",
    alias: ["d20"],
    description: "Lanza un dado y ve que te sale.",

    async execute(message, args, commandName) {

        let rotation = 8
        let x = 107
        let y = 110

        r20 = function (limit, sides) {
            this.limit = limit
            this.sides = sides
            let faceResult = []

            if (!sides) {
                let roll = Math.floor((Math.random() * limit) + 1)
                return roll
            } else {
                for (let i = 0; i < sides; i++) {
                    faceResult[i] = Math.floor((Math.random() * limit) + 1)
                }
                return faceResult
            }
        }

        //Loading the background dice image and resolving the path.
        const bg = await Canvas.loadImage(path.resolve("./assets/dice.png"))

        //Canvas declaration
        const cdef = Canvas.createCanvas(200, 200)

        //Context declaration
        let ctx = cdef.getContext("2d")
        ctx.drawImage(bg, 0, 0, cdef.width, cdef.height)

        if (commandName == "d20") {
            //Result display
            ctx.font = "58px serif"
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.rotate(rotation * Math.PI / 180)
            ctx.fillText(`${r20(20)}`, x, y)

            let attachement = new Discord.Attachment(cdef.toBuffer(), "d20.png")
            message.channel.send(attachement)

        } else if (commandName == "roll") {

            if (!args.length) {
                return message.reply("debes introducir el numero máximo para lanzar el dado.")
            } else if (args.length < 2) {
                if (isNaN(args[0])) {
                    return message.channel.send("Argumentos inválidos")
                }
                message.channel.send(`¡Te ha salido **${r20(args[0])}**!`)
            } else if (args.length > 1 && args.length < 3) {
                if (isNaN(args[0]) || isNaN(args[1])) {
                    return message.channel.send("Argumentos inválidos")
                }
                message.channel.send(`Lanzaste ${args[1]} dados de ${args[0]} caras, ¡Te ha salido **${r20(args[0], args[1]).join(", ")}**!`)
            } else {
                return message.channel.send("Argumentos inválidos.")
            }
        }
    },
}