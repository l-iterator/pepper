import random from "random"

export default {
    name: 'shoot',
    category: 'Игры',
    description: 'стреляет (контест)',
    verboseDescription: 'Эта команда только для участников контеста, а именно reali_, oh_shiet, eternalnecromancer, ahsatanikaer',
    args: [
        {
            name: 'цель',
            description: 'Ник юзера. Стреляет в него с вероятностью попасть 1%',
            required: true
        }
    ],
    async execute(message, args) {
        const { shootContestants } = message.client.db.data;
        const shooterId = message.author.id;
        const shooterState = shootContestants.find(({ id }) => id == shooterId);
        const target = shootContestants.find(({ nick }) => nick == args[0]);
        const targets = shootContestants.filter(({ alive, id }) => alive && id != shooterId)
                                        .map(({ nick }) => nick)
                                        .join(", ");
        
        if (shooterState && shooterState.alive) {
            if (target) {
                const hit = random.int(1, 100) == 1;
                if (hit) {
                    const deadMember = message.guild.members.fetch({ user: target.id })

                    const shootRoles = message.client.db.data.shootStateRoles;

                    deadMember.roles.remove(shootRoles.alive);
                    deadMember.roles.add(shootRoles.dead);
                    
                    message.reply(`Ты попал по цели, <@${target.id}> выбывает из игры.`);
                    target.alive = false;

                    await message.client.db.write();
                } else {
                    message.reply(`Не попал`);
                }
            } else {
                message.reply("Ты по нему не можешь стрелять, твои цели: " + targets);
            }
        } else {
            if (!shooterState) {
                message.reply("Ты не участник эвента")
            } else {
                message.reply("Всё, ты уже сдох");
            }
        }
    },
};