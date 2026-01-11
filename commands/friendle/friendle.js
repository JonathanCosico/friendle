const { getInitialBoard, getResult, printBoard, printResult } = require('../../game/game');
const { SlashCommandBuilder, ThreadAutoArchiveDuration, MessageFlags } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('friendle')
        .setDescription('Make your own friendle game!')
        .addStringOption(option => option.setName('word').setDescription('The word you want to use for your friendle game!').setRequired(true)),
	async execute(interaction) {
        // create thread name
        const threadName = `${interaction.user.username}'s friendle game`;
        const word = interaction.options.getString('word').toLowerCase();

        // create thread
        const thread = await interaction.channel.threads.create({
            name: threadName,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
        });
        // show initial board
        await thread.send(getInitialBoard(word));

        // send ephemeral message to user that thread was created - does this bc otherwise the bot acts up
        await interaction.reply({content: `Thread created: ${thread.name}`, flags: MessageFlags.Ephemeral});

        // listen for guesses in thread only if message is same length as word
        const collectorFilter = (m) => m.content.length === word.length && m.author.id !== interaction.client.user.id;
        const collector = thread.createMessageCollector({filter: collectorFilter});
        const usedLetters = new Map();

        collector.on('collect', (message) => {
            const guess = message.content.toLowerCase();
            const {correct, result} = getResult(word, guess);
            if (correct) {
                collector.stop();
                thread.send({files: ["assets/yippee-happy.gif"]});
                thread.send(`The word was ${word}.`);
                thread.send("guess:\n" + printResult(guess, result));
            } else {
                // update usedLetters map to output formatted keyboard
                for (i=0; i<result.length; i++) {
                    const ch = guess[i];
                    const status = result[i];
                    if (usedLetters.has(ch)) {
                        // If the letter is already in the map, only update if the new status is more informative
                        const currentStatus = usedLetters.get(ch);
                        if (status === 'G' || (status === 'Y' && currentStatus !== 'G')) {
                            usedLetters.set(ch, status);
                        }
                    } else {
                        usedLetters.set(ch, status);
                    }
                }
                thread.send("guess:\n" + printResult(guess, result));
                thread.send("board:\n" + printBoard(usedLetters));
            }
        });
    },
};
