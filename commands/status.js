const {repository} = require('../config.json');

module.exports = {
    
    name: 'status',
    description: 'Estado del bot.',
    
    execute(message, args) {

        const creationDate = new Date(message.guild.createdTimestamp)

        msToHMS = function (ms) {
            // 1- Convert to seconds:
            let seconds = Math.round(ms / 1000);
            // 2- Extract hours:
            let hours = Math.round(parseInt(seconds / 3600)); // 3,600 seconds in 1 hour
            seconds = seconds % 3600; // seconds remaining after extracting hours
            // 3- Extract minutes:
            let minutes = Math.round(parseInt(seconds / 60)); // 60 seconds in 1 minute
            // 4- Keep only seconds not extracted to minutes:
            seconds = seconds % 60;
            return(hours+"h"+":"+minutes+"m"+":"+seconds+"s");
        }

        guildSize = function (message) {
            if (message.client.guilds.size > 1) {
                return `Actualmente presente en ${message.client.guilds.size} servidores.`
            }
            else {
                return `Actualmente presente en ${message.client.guilds.size} servidor.`
            }
        }
        
        message.channel.send({embed: {
            color: 3447003,
            author: {
                name: message.client.user.username,
                icon_url: message.client.user.avatarURL
            },
            description:
            guildSize(message),
            thumbnail: {
                url: message.guild.iconURL,
            },
            fields: [
                {
                    name: "Información general",
                    value: `Servidor actual: ${message.guild.name}
                    Miembros en total: ${message.guild.memberCount}
                    Fecha de creación: ${creationDate.toLocaleString('en-GB')}`
                },
                {
                    name: "Estado del bot",
                    value: `Tiempo de actividad: `+ msToHMS(message.client.uptime) +
                    `\nLatencia del API: ${Math.round(message.client.ping)}ms`
                }
            ],
            timestamp: Date.now(),
            footer: {
                icon_url: message.client.user.avatarURL,
                text: repository
            }
          }});
    },
}