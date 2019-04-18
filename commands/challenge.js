const {prefix} = require('../config.json');
module.exports = {

    name: 'challenge',
    description: 'Sera un duelo a muerte con cuchillos.',
    usage: `<rival>`,
    async execute(message, args) {

    function Player (name, id, health, currentTurn, afk) {
        this.name = name;
        this.id = id;
        this.health = health;
        this.currentTurn = currentTurn;
        this.afk = afk;
    }

    function Weapon (damage, chance) {
        this.damage = damage;
        this.chance = chance;
    };

    let Dagger = new Weapon(25, 80)

    async function Attack (Player, Weapon) {
        let roll = Math.floor((Math.random() * 100) + 1);
            console.log(`Rolled ${roll}`);
            if (roll < Weapon.chance) {
                message.channel.send(`Golpe asestado!`);
                Player.health -= Weapon.damage;
            }
            else {
                message.channel.send(`Ataque fallido.`);
            }
        return
    }    
    
    console.log (Dagger.damage);
    console.log (Dagger.chance);
   
    let gameloop = async function() {

        console.log(`Se iniciado una partida del Coliseo.`)
        //Escoge un usuario al azar para empezar el turno.
        const userList = [message.mentions.users.first(), message.author];
        let turnOrder = userList.slice (Math.random() * userList.length);
        if (turnOrder[0] == userList[1]) {
        turnOrder.push (userList[0]);
        }

        one = new Player (turnOrder[0].username, turnOrder[0].id, 100, true, false);
        two = new Player (turnOrder[1].username, turnOrder[1].id, 100, false, false);

        console.log(`El orden de turnos es ${turnOrder[0].tag}, ${turnOrder[1].tag}.`);     

        while (!(one.health <= 0 || two.health <= 0) && !(one.afk || two.afk)) {
            if (one.currentTurn && !(one.afk || two.afk)) {
                message.channel.send(`Es tu turno ${turnOrder[0]}, tienes 30 segundos, usa ${prefix}k para atacar.`)
                await message.channel.awaitMessages(msg => (msg.author == turnOrder[0] && msg.content == `${prefix}k`), {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then(() => {
                    Attack(two, Dagger);
                    message.channel.send(`Salud de los contrincantes, ${turnOrder[0]}: ${one.health}. ${turnOrder[1]}: ${two.health}`);
                    one.currentTurn = false; two.currentTurn = true;
                    return
                    })
                    .catch(() => {
                      message.channel.send(`Parece que ${turnOrder[0]} no esta ahi.`);
                      one.afk = true;
                      return
                    });
               
            }
            else if (two.currentTurn && !(one.afk || two.afk)) {
                message.channel.send(`Es tu turno ${turnOrder[1]}, tienes 30 segundos, usa ${prefix}k para atacar.`)
                await message.channel.awaitMessages(msg => (msg.author == turnOrder[1] && msg.content == `${prefix}k`), {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then(() => {
                    Attack(one, Dagger);
                    message.channel.send(`Salud de los contrincantes, ${turnOrder[0]}: ${one.health}. ${turnOrder[1]}: ${two.health}`);
                    one.currentTurn = true; two.currentTurn = false;
                    return
                    })
                    .catch(() => {
                      message.channel.send(`Parece que ${turnOrder[1]} no esta ahi.`);
                      two.afk = true;
                      return
                    });
                
            }
        }

        if ((one.health > two.health) && !(one.afk || two.afk)) {
            message.channel.send(`<@${one.id}> es el vencedor!`)
        }
        else if ((one.health < two.health) && !(one.afk || two.afk)) {
            message.channel.send(`<@${two.id}> es el vencedor!`)
        }
        else {
            message.channel.send("Partida cancelada.")
        }

    }

    //Misc checks

    if (!message.mentions.users.size) {
     return message.reply("Debes mencionar a otro usuario para desafiarle.");
    }

        else if (message.mentions.users.size >= 2) {
            return message.reply("Solo puedes luchar contra uno a la vez!");
        }

            else if (message.mentions.users.first() === message.author) {
                return message.reply("No te hagas daño, tontillo.");
    }

    message.channel.send(`${message.mentions.users.first()}, ${message.author} desea desafiarte a un duelo a muerte con cuchillos, aceptas el reto?` +
    `\nResponde con 1, o 2 si quieres rechazar el duelo. Esta invitacion expirara automaticamente en 15 segundos.`)
    .then(() => {
      message.channel.awaitMessages(msg => (msg.author == message.mentions.users.first()) && (msg.content == ("1") || msg.content == ("2")), {
        max: 1,
        time: 15000,
        errors: ['time'],
      })
      .then((collected) => {
          if (collected.first().content == "1"){
              message.channel.send("Desafio aceptado.").then(() => {
                        gameloop();
                    }
                  )
          }
          else if (collected.first().content == "2"){
              message.channel.send("Desafio rechazado.");
          }
        })
        .catch(() => {
          message.channel.send(`Al parecer ${message.mentions.users.first()} no esta ahi.`);
        });
    });
    },
}
