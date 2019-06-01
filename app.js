//Main Dependencies
const fs = require('fs');
const Discord = require('discord.js');

//Configuration
const {prefix} = require('./config.json');
const token = process.env.BOT_TOKEN;

//Setting up client and command collection
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(`${command.name}.js has been loaded.`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.username}.`);
  client.user.setActivity("with your feelings", {type: "PLAYING"})
});

client.on('message', async message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/);  
  const cmdname = args.shift().toLowerCase();

  const command = client.commands.get(cmdname) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(cmdname));

  if (!command) return

  try {
    command.execute(message, args, cmdname);
  } catch (error) {
    console.log(error);
    message.reply("Ha ocurrido un error al ejecutar el comando!");
  }
});

client.login(token);