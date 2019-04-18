const {prefix} = require('../config.json');
module.exports = {
	name: 'help',
	description: 'Genera una lista de comandos disponibles y provee ayuda para usar comandos en especifico.',
	execute(message, args) {
        const {commands} = message.client;

        if (!args.length) {
            message.channel.send('Esta es la lista de mis comandos actuales. '+(`Usa ${prefix}help <comando> para mas informacion.`));
            message.channel.send(("```css\n")+`${commands.map(command => command.name).join(', ')}`+("```"));
        }

        else {
        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if (!command) {
            return message.reply(', ese no es un comando valido!');
        }

        if (command.description) message.channel.send(`**Descripcion:** ${command.description}`);
        if (command.usage) message.channel.send(`**Uso:** ${prefix}${command.name} ${command.usage}`);
        }
	},
};