module.exports = {
    
    name: 'status',
    description: 'Estado del bot.',
    execute(message, args) {
        message.channel.send({embed: {
            color: 3447003,
            author: {
                name: message.client.user.username,
                icon_url: message.client.user.avatarURL
            },
            description: 
            `Actualmente presente en ${message.client.guilds.size} servidores.`,
            thumbnail: {
                url: message.guild.icon_url,
            },
            fields: [
                {
                    name: "Información",
                    value: `Servidor actual: ${message.guild.name}
                    Miembros en total: ${message.guild.memberCount}\n`
                }
            ]      
          }});
    },
}