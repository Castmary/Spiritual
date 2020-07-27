const { MessageEmbed } = require('discord.js');
const { evaluate } = require('mathjs');

module.exports = {
    config: {
        name: 'calculate',
        description: 'Use this to figure out any math equation! And to help with your homework...',
        usage: 'calculate',
        accessableby: 'Members',
        aliases: ['math', 'solve', 'calc'],
        category: 'utility',
    },

    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('Charles\' Law: P1 ÷ T1 = P2 ÷ T2, where T is in Kelvin. Can\'t calculate nothing.')

        try {
            const embed = new MessageEmbed()
                .setColor(message.color)
                .addField('Input', `\`\`\`js\n${args.join(' ')}\`\`\``)
                .addField('Output', `\`\`\`js\n${evaluate(args.join(' '))}\`\`\``)

            return message.channel.send(embed)
        } catch (e) {
            message.channel.send('Please put in an equation.')
        }
    }
}