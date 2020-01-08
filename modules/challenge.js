const {
    prefix
} = require("../config/vars.json");
const Weapon = require("../config/weapons.json");
const attackMsg = require("../config/attackMsg.json");

module.exports = {

    name: 'challenge',
    description: 'Enfrenta a tu oponente y desafiale a un duelo a muerte.',
    usage: '@rival',
    alias: ["retar"],

    async execute(message, args) {

        let data = [];

        let pAssign = function () {
            console.log(attackMsg.onHit[0]);
        }

        let Attack = function (Player, Weapon) {

            let roll = Math.floor((Math.random() * 100) + 1);

            if (roll <= Weapon.chance) {
                pAssign();
                Player.hp -= Weapon.damage;
                return `¡Ha acertado! (**${roll}** < ${Weapon.chance})`;
            } else {
                return `¡Ha fallado! (**${roll}** > ${Weapon.chance})`;
            }
        }

        let gameloop = async function () {

            console.log(`Se iniciado una partida del Coliseo en ${message.guild.name}.`)
            //Escoge un usuario al azar para empezar el turno.
            const userList = [message.mentions.users.first(), message.author];
            let Player = userList.slice(Math.random() * userList.length);
            if (Player[0] == userList[1]) {
                Player.push(userList[0]);
            }

            Player[0].hp = 100;
            Player[1].hp = 100;
            Player[0].afk = false;
            Player[1].afk = false;

            console.log(`El orden de turnos es ${Player[0].tag}, ${Player[1].tag}.`);
            const WeaponRegex = new RegExp(`^(${prefix}k|${prefix}b|${prefix}r)$`);

            while (!(Player[0].hp <= 0 || Player[1].hp <= 0) && !(Player[0].afk)) {

                await message.channel.send(`Es tu turno ${Player[0]}, tienes 30 segundos, usa ${prefix}k, ${prefix}b o ${prefix}r para atacar.`);

                await message.channel.awaitMessages(msg => (msg.author == Player[0] && msg.content.match(WeaponRegex)), {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        for (let i = 0; i < Weapon.length; i++) {
                            if (collected.first().content.includes(Weapon[i].command)) {
                                data.push((`¡${Player[0]} ha atacado a ${Player[1]} con una ${Weapon[i].name} ${Weapon[i].icon}!... y `) + (Attack(Player[1], Weapon[i])));
                            }
                        }
                        data.push(`Salud de los contrincantes, ${Player[0]}: ${Player[0].hp}. ${Player[1]}: ${Player[1].hp}`);
                        Player.reverse();
                        return message.channel.send(data, {
                            split: true
                        });
                    })
                    .catch(() => {
                        message.channel.send(`Parece que ${Player[0]} no esta ahi.`);
                        Player[0].afk = true;
                        return
                    });
                data = [];
            }

            if ((Player[0].hp > Player[1].hp) && !(Player[0].afk)) {
                message.channel.send(`${Player[0]} es el vencedor!`)
            } else if ((Player[0].hp < Player[1].hp) && !(Player[0].afk)) {
                message.channel.send(`${Player[1]} es el vencedor!`)
            } else {
                message.channel.send("Partida cancelada.")
            }
        }

        //Misc checks

        if (!message.mentions.users.size) {
            return message.reply("Debes mencionar a otro usuario para desafiarle.");
        } else if (message.mentions.users.size >= 2) {
            return message.reply("Solo puedes luchar contra uno a la vez!");
        } else if (message.mentions.users.first() === message.author) {
            return message.reply("No te hagas daño, tontillo.");
        }

        message.channel.send(`${message.mentions.users.first()}, ${message.author} desea desafiarte a un duelo a muerte con cuchillos, aceptas el reto?` +
                `\nResponde con 1, o 2 si quieres rechazar el duelo. Esta invitación expirara automáticamente en 30 segundos.`)
            .then(() => {
                message.channel.awaitMessages(msg => (msg.author == message.mentions.users.first()) && (msg.content == ("1") || msg.content == ("2")), {
                        max: 1,
                        time: 30000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        if (collected.first().content == "1") {
                            message.channel.send("Desafió aceptado.").then(() => {
                                gameloop();
                            })
                        } else if (collected.first().content == "2") {
                            message.channel.send("Desafió rechazado.");
                        }
                    })
                    .catch(() => {
                        message.channel.send(`Al parecer ${message.mentions.users.first()} no esta ahi.`);
                    });
            });
    },
}