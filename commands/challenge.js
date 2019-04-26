const {prefix} = require('../config.json');
module.exports = {

    name: 'challenge',
    description: 'Desafia a tu oponente a un duelo a muerte.',
    usage: `<rival>`,
    async execute(message, args) {
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
                damage: "40",
                chance: "60"
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
        let roll = Math.floor((Math.random() * 100) + 1);
            if (roll <= Weapon.chance) {
                message.channel.send(`Golpe asestado!. Lanzaste ${roll}. Probabilidad ${Weapon.chance}`);
                Player.hp -= Weapon.damage;
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
        let Player = userList.slice (Math.random() * userList.length);
        if (Player[0] == userList[1]) {
            Player.push (userList[0]);
        }

        Player[0].hp = 100; Player[1].hp = 100;
        Player[0].afk = false; Player[1].afk = false;

        console.log(`El orden de turnos es ${Player[0].tag}, ${Player[1].tag}.`);
        const WeaponRegex = new RegExp(`^(${prefix}k|${prefix}b|${prefix}r)$`);

        while (!(Player[0].hp <= 0 || Player[1].hp <= 0) && !(Player[0].afk)) {
                message.channel.send(`Es tu turno ${Player[0]}, tienes 30 segundos, usa ${prefix}k, ${prefix}b o ${prefix}r para atacar.`)
                await message.channel.awaitMessages(msg => (msg.author == Player[0] && msg.content.match(WeaponRegex)), {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                  })
                  .then((collected) => {
                    for (let i = 0; i < Weapon.List.length; i++) {
                        if (Weapon.List[i].command == collected.first().content) {
                            console.log(`Arma detectada: `+`${Weapon.List[i].name}`);
                            Attack(Player[1], Weapon.List[i]);
                        }
                    }
                    message.channel.send(`Salud de los contrincantes, ${Player[0]}: ${Player[0].hp}. ${Player[1]}: ${Player[1].hp}`);
                    Player.reverse();
                    return
                    })
                    .catch(() => {
                      message.channel.send(`Parece que ${Player[0]} no esta ahi.`);
                      Player[0].afk = true;
                      return
                    });
            }
         

        if ((Player[0].hp > Player[1].hp) && !(Player[0].afk)) {
            message.channel.send(`${Player[0]} es el vencedor!`)
        }
        else if ((Player[0].hp < Player[1].hp) && !(Player[0].afk)) {
            message.channel.send(`${Player[1]} es el vencedor!`)
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
