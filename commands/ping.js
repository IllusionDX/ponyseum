module.exports = {
    
    name: 'ping',
    description: 'Comprueba si el bot esta en linea.',
    
    execute(message, args) {
        let response = [
            "Buenos días, comandante...","Frecuencias de comunicación abiertas.","Identifícate.","Transmisión recibida.","Tripulación reportándose.","Escudos activos, armas en linea. . . ."
            ]
          
          function randomResponse() {
          return response[Math.floor(Math.random() * response.length)];
          }
          
        message.channel.send(randomResponse());
    },
}