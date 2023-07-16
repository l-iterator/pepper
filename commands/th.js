import random from "random"
import createFirmEmbed from '../utils/embed.js';
import fs from 'fs';

const { prefix } = JSON.parse(fs.readFileSync('./config.json'));

const coord2pos = {
    'a1': 0, 'a2': 1, 'a3': 2, 'a4': 3,
    'b1': 4, 'b2': 5, 'b3': 6, 'b4': 7,
    'c1': 8, 'c2': 9, 'c3': 10, 'c4': 11,
    'd1': 12, 'd2': 13, 'd3': 14, 'd4': 15
};

const treasures = [
    {
        name: "Удваивание полученных коинов",
        icon: "⭐",
        score: 0
    },
    {
        name: "Все имеющиеся коины обнуляются",
        icon: "☠️",
        score: 0
    },
    {
        name: "+3 коина",
        icon: ":k_grape:",
        score: 3
    },
    {
        name: "+4 коина",
        icon: ":k_orange:",
        score: 4
    },
    {
        name: "+5 коинов",
        icon: ":k_cherry:",
        score: 5
    },
    {
        name: "+6 коинов",
        icon: ":k_clover:",
        score: 6
    },
    {
        name: "+7 коинов",
        icon: ":k_bell:",
        score: 7
    },
    {
        name: "+10 коинов",
        icon: ":k_diamond:",
        score: 10
    },
];

const missingTreasure = {
    name: "Нет коинов",
    icon: ":white_square_button:",
    score: 0
};

function generateTreasureMap() {
    let positions = [...Array(16).keys()];
    let result = [];

    for (let i = 0; i < 8; ++i) {
        const pickedPos = random.choice(positions);
        positions = positions.filter(e => e != pickedPos);
        result.push(pickedPos);
    }

    return result;
}

function drawMap(treasureMap) {
    let drawnMap = [
        [":black_small_square:", ":regional_indicator_a:", ":regional_indicator_b:", ":regional_indicator_c:", ":regional_indicator_d:"],
        [":one:", ":white_square_button:", ":white_square_button:", ":white_square_button:", ":white_square_button:"],
        [":two:", ":white_square_button:", ":white_square_button:", ":white_square_button:", ":white_square_button:"],
        [":three:", ":white_square_button:", ":white_square_button:", ":white_square_button:", ":white_square_button:"],
        [":four:", ":white_square_button:", ":white_square_button:", ":white_square_button:", ":white_square_button:"],
    ]

    for (let i in treasureMap) {
        const pos = treasureMap[i];
        drawnMap[Math.floor(pos / 4) + 1][pos % 4 + 1] = treasures[i].icon;
    }

    return drawnMap.map(s => s.join(" ")).join("\n");
}

export default {
    name: 'th',
    category: 'Игры',
    description: 'синглплеерный сыщик',
    verboseDescription: `Введи разные координаты 4x4 сетки, чтобы найти некоторые из этих предметов:
:k_diamond: – алмаз, 10 коинов.
:k_bell: – колокольчик, 7 коинов.
:k_clover: – клевер, 6 коинов.
:k_cherry: – вишня, 5 коинов.
:k_orange: – апельсин, 4 коина.
:k_grape: – виноград, 3 коина.
☠️ – смэрть, обнуляет вообще все коины юзера.
⭐ – удваивает найденные коины`,
    args: [
        {
            name: 'к1',
            description: 'Первая координата, состоящая из буквы (A, B, C, D) и цифры (1, 2, 3, 4). Например, A1, B2, C3, D4',
            required: true
        },
        {
            name: 'к2',
            description: 'Вторая координата, в том же формате',
            required: true
        },
        {
            name: 'к3',
            description: 'Третья координата, ну ты понял',
            required: true
        }
    ],
    async execute(message, args) {
        if (args[0].match(/^[abcd][1234]$/) && 
            args[1].match(/^[abcd][1234]$/) && 
            args[2].match(/^[abcd][1234]$/)) {
            if (args[0] == args[1] || args[0] == args[2] || args[1] == args[2]) {
                message.reply(`Все координаты должны быть разные`);
            }
            const treasureMap = generateTreasureMap();

            const coords = [coord2pos[args[0]], coord2pos[args[1]], coord2pos[args[2]]];

            const userState = message.client.db.data.userData[message.author.id] ?? {coins: 0};
            
            let isDouble = false;
            let isDeath = false;
            let score = 0;
            let result = createFirmEmbed().setTitle("Результат игры");

            for (let i in coords) {
                const treasureIndex = treasureMap.indexOf(coords[i]);
                const treasure = treasures[treasureIndex] ?? missingTreasure;
                score += treasure.score;
                if (treasureIndex == 0) {
                    isDouble = true;
                } else if (treasureIndex == 1) {
                    isDeath = true;
                }

                result.addFields({
                    name: `${args[i].toUpperCase()} - ${treasure.icon}`,
                    value: `${treasure.name}`
                });
            }

            if (isDouble) score *= 2;
            userState.coins += score;
            
            if (isDeath) {
                userState.coins = 0;
                result.setDescription(`Ты потерял все свои деньги!`);
            } else {
                result.setDescription(`Ты получил ${score} коинов, в итоге у тебя ${userState.coins} коинов!`);
            }

            message.client.db.data.userData[message.author.id] = userState;
            await message.client.db.write();

            await message.reply(drawMap(treasureMap));
            const resultMessage = await message.reply({ embeds: [result] });

            if (isDeath) {
                resultMessage.reply("🤣 👉");
            }
        } else {
            message.reply(`Координаты в неправильном формате, обратись за помощью в \`${prefix}help th.\``)
        }
    },
};