module.exports = {
    
    name: 'status',
    description: 'Estado del bot.',
    execute(client, message, args) {
        message.channel.send({embed: {
            color: 3447003,
            author: {
                name: message.client.user.username,
                icon_url: message.client.user.avatarURL
            },
            description: 
            `Actualmente presente en ${message.client.guilds.size} servidores.`,
            thumbnail: {
                url: message.guild.iconURL,
            },
            fields: [
                {
                    name: "Información general",
                    value: `Servidor actual: ${message.guild.name}
                    Miembros en total: ${message.guild.memberCount}\n`,
                    name: "Estado del bot",
                    value: `Tiempo de actividad: ${client.uptime}`
                }
            ]      
          }});
    },
}