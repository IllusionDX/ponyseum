module.exports = {
    
    name: 'status',
    description: 'Estado del bot.',
    execute(message, args) {

        function msToHMS(ms) {
            // 1- Convert to seconds:
            var seconds = ms / 1000;
            // 2- Extract hours:
            var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
            seconds = seconds % 3600; // seconds remaining after extracting hours
            // 3- Extract minutes:
            var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
            // 4- Keep only seconds not extracted to minutes:
            seconds = seconds % 60;
            return(hours+"h"+":"+minutes+"m"+":"+seconds+"s");
        }
        
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
                    Miembros en total: ${message.guild.memberCount}\n`
                },
                {
                    name: "Estado del bot",
                    value: `Tiempo de actividad: ${mstoHMS(message.client.uptime)} `
                }
            ]      
          }});
    },
}