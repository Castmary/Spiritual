const { MessageEmbed } = require('discord.js');
const { add, fetch } = require('quick.db')

module.exports = {
    config: {
        name: 'slots',
        description: 'Play the slot machine.',
        usage: 'slots',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        let choices = [], slots = ['🍌', '🍎', '🍉', '🍇', '🍊'];
        for (var i = 0; i < 3; i++) choices.push(slots[~~(Math.random() * 5)])

        if (new Set(choices).size < 3) {
            const Embed = new MessageEmbed()
                .setFooter('You Won!', message.author.avatarURL())
                .setTitle('🎰Slots🎰')
                .addField('Result:', choices.join(' '), true)
                .setColor(message.color);
            message.channel.send(Embed);
        } else {
            const Embed = new MessageEmbed()
                .setFooter('You Lost!', message.author.avatarURL())
                .setTitle('🎰Slots🎰')
                .addField('Result', choices.join(' '), true)
                .setColor(message.color);
            message.channel.send(Embed);
        }
    }
}
