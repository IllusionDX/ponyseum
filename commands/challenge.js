const {prefix} = require('../config.json');
module.exports = {

    name: 'challenge',
    description: 'Desafia a tu oponente a un duelo a muerte.',
    usage: `<rival>`,
    async execute(message, args) {

    function Player (player, health, currentTurn, afk) {
        this.player = player;
        this.health = health;
        this.currentTurn = currentTurn;
        this.afk = afk;
    }

    let Weapon = {
        List : [
            {
                name: "Daga",
                command: `${prefix}k`,
                damage: "20",
                chance: "80"
            },
            {
                name: "Ballesta",
                command: `${prefix}b`,
                damage: "60",
                chance: "40"
            },
            {
                name: "Red",
                command: `${prefix}r`,
                damage: "80",
                chance: "20"
            }
        ]
    };

    async function Attack (Player, Weapon) {
        console.log('Attack function called');
        let roll = Math.floor((Math.random() * 100) + 1);
            if (roll <= Weapon.chance) {
                message.channel.send(`Golpe asestado!. Lanzaste ${roll}. Probabilidad ${Weapon.chance}`);
                Player.health -= Weapon.damage;
            }
            else {
                message.channel.send(`Has fallado el ataque. Lanzaste ${roll}. Probabilidad ${Weapon.chance}`);
            }
        return
    }    
       
    let gameloop = async function() {

        console.log(`Se iniciado una partida del Coliseo.`)
        //Escoge un usuario al azar para empezar el turno.
        const userList = [message.mentions.users.first(), message.author];
        let turnOrder = userList.slice (Math.random() * userList.length);
        if (turnOrder[0] == userList[1]) {
        turnOrder.push (userList[0]);
        }

        one = new Player (turnOrder[0], 100, true, false);
        two = new Player (turnOrder[1], 100, false, false);

        console.log(`El orden de turnos es ${turnOrder[0].tag}, ${turnOrder[1].tag}.`);
        const WeaponRegex = new RegExp(`^(${prefix}k|${prefix}b|${prefix}r)$`);

        while (!(one.health <= 0 || two.health <= 0) && !(one.afk || two.afk)) {
            if (one.currentTurn && !(one.afk || two.afk)) {
                message.channel.send(`Es tu turno ${turnOrder[0]}, tienes 30 segundos, usa ${prefix}k, ${prefix}b o ${prefix}r para atacar.`)
                await message.channel.awaitMessages(msg => (msg.author == turnOrder[0] && msg.content.match(WeaponRegex)), {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then((collected) => {
                    for (let i = 0; i < Weapon.List.length; i++) {
                        if (Weapon.List[i].command == collected.first().content) {
                            console.log(`Arma detectada`);
                            console.log(Weapon.List[i].name);
                            Attack(two, Weapon.List[i]);
                        }
                    }
                    message.channel.send(`Salud de los contrincantes, ${one.player}: ${one.health}. ${two.player}: ${two.health}`);
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
                message.channel.send(`Es tu turno ${turnOrder[1]}, tienes 30 segundos, usa ${prefix}k, ${prefix}b o ${prefix}r para atacar.`)
                await message.channel.awaitMessages(msg => (msg.author == turnOrder[1] && msg.content.match(WeaponRegex)), {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then((collected) => {
                    for (let i = 0; i < Weapon.List.length; i++) {
                        if (Weapon.List[i].command == collected.first().content) {
                            console.log(`Arma detectada`);
                            console.log(Weapon.List[i].command);
                            Attack(one, Weapon.List[i]);
                        }
                    }
                    message.channel.send(`Salud de los contrincantes, ${one.player}: ${one.health}. ${two.player}: ${two.health}`);
                    two.currentTurn = false; one.currentTurn = true;
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
            message.channel.send(`${one.player} es el vencedor!`)
        }
        else if ((one.health < two.health) && !(one.afk || two.afk)) {
            message.channel.send(`${two.player} es el vencedor!`)
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
