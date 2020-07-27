const { MessageEmbed } = require('discord.js');
const { add, fetch } = require('quick.db')

module.exports = {
    config: {
        name: 'say',
        description: 'Repeats a sentence or word a user has requested.',
        usage: 'say <sentence/word>',
        accessableby: 'Members',
        aliases: '',
        category: 'fun',
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('Please say something so I can repeat it!')

        let sayembed = new MessageEmbed()
            .setAuthor(`I shall say what I am forced to say..`)
            .setDescription(args.join(' '))
            .setColor(message.color)
            .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))

        return message.channel.send(sayembed)
    }
}
