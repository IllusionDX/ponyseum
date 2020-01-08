const {
    prefix
} = require('../config/vars.json');

module.exports = {

    name: 'help',
    alias: ["ayuda"],
    description: 'Genera una lista de comandos disponibles y provee ayuda para usar comandos en especifico.',

    execute(message, args, cmdname) {

        const {
            commands
        } = message.client;

        if (!args.length) {
            message.channel.send('Estos son mis comandos. ' + (`Usa ${prefix}${cmdname} <comando> para mas información.`));
            message.channel.send(
                ("```css\n") +
                `${commands.map(command => command.name).filter(Boolean).join(', ')}` +
                ("```"));
        } else {
            const command = commands.get(args[0].toLowerCase());

            if (!command) {
                return message.reply('ese no es un comando valido!');
            }

            if (command.description) message.channel.send(`**Descripción:** ${command.description}`);
            if (command.usage) message.channel.send(`**Uso:** ${prefix}${command.name} ${command.usage}`);
            if (command.alias) message.channel.send(`**Alias:** ${command.alias}`);
        }
    },
};