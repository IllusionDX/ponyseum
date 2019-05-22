const fs = require('fs');
const Discord = require('discord.js');
const {prefix} = require('./config.json');
const token = process.env.BOT_TOKEN;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.username}.`);
  client.user.setActivity("with your feelings", {type: "PLAYING"})
});

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));

  if (!command) return

  try {
    command.execute(message, args, commandName);
  } catch (error) {
    console.log(error);
    message.reply("Ha ocurrido un error al ejecutar el comando!");
  }
  
});

client.login(token);