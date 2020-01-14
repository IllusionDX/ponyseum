module.exports = {

    name: "ping",
    description: "Comprueba si el bot esta en linea.",

    async execute(message, args) {
        
        let response = [
            "Buenos días, comandante...", "Frecuencias de comunicación abiertas.", "Identifícate.", "Transmisión recibida.", "Tripulación reportándose.", "Escudos activos, armas en linea. . . ."
        ]

        function randomResponse() {
            return response[Math.floor(Math.random() * response.length)]
        }

        message.channel.send(randomResponse())
        const m = await message.channel.send("Ping?")
        m.edit(`Pong! La latencia es ${m.createdTimestamp - message.createdTimestamp}ms.`)
    },
}