// create thread
// send first msg in thread
const {getInitialBoard, getResult} = require('../../game/game');
const { SlashCommandBuilder, ThreadAutoArchiveDuration, MessageFlags, Attachment } = require('discord.js');

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
        await thread.send(getInitialBoard(word));

        // send ephemeral message to user that thread was created
        await interaction.reply({content: `Thread created: ${thread.name}`, flags: MessageFlags.Ephemeral});

        // create message collector to listen for guesses in thread only if message is a valid guess (same length as word)
        const collectorFilter = (m) => m.content.length === word.length && m.author.id !== interaction.client.user.id;
        const collector = thread.createMessageCollector({filter: collectorFilter});
        const usedLetters = new Set();

        collector.on('collect', (message) => {
            const {correct, result, wrongLetters} = getResult(word, message.content.toLowerCase());
            wrongLetters.split('').forEach((ch) => usedLetters.add(ch));
            if (correct) {
                collector.stop();
                thread.send({files: ["assets/yippee-happy.gif"]});
                thread.send(`The word was ${word}.`);
                thread.send(result);
            } else {
                thread.send(result);
                thread.send(`Wrong letters: ${Array.from(usedLetters).sort().join(', ')}`);
            }
        });
    },
};
