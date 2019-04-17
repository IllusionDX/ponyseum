module.exports = {
    
    name: 'ping',
    description: 'Comprueba si el bot esta en linea.',
    execute(message, args) {
        var response = [
            "Buenos dias, comandante...","Frequencias de comunicación abiertas.","Identifiquese.","Transmision recibida.","Tripulacion reportandose.","Escudos activos, armas en linea. . . ."
            ]
          
          function randomResponse() {
          return response[Math.floor(Math.random() * response.length)];
          }
          
        message.channel.send(randomResponse() + `\nPing: ${client.ping}`);
    },
}