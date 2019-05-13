module.exports = {
    
    name: 'ping',
    description: 'Comprueba si el bot esta en linea.',
    execute(message, args) {
        var response = [
            "Buenos días, comandante...","Frecuencias de comunicación abiertas.","Identifícate.","Transmisión recibida.","Tripulación reportandose.","Escudos activos, armas en linea. . . ."
            ]
          
          function randomResponse() {
          return response[Math.floor(Math.random() * response.length)];
          }
          
        message.channel.send(randomResponse());
    },
}