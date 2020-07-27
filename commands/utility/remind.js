
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = {
    config: {
        name: 'remind',
        description: 'DMs you with what you want it to remind you with in the time you want it to remind you in.',
        usage: 'remind <time> <reminder message>',
        accessableby: 'Members',
        aliases: [],
        category: 'utility',
    },
    run: async (client, message, args) => {
        const embed = new MessageEmbed({ color: message.color })

        if (!args[0] || !ms(args[0])) return message.channel.send(embed.setDescription('Please provide a time to remind you in.')).then(m => m.delete({ timeout: 5000 }));

        if (!args[1]) return message.channel.send(embed.setDescription('Please provide something I can remind you about!')).then(m => m.delete({ timeout: 5000 }));

        setTimeout(() => {
            embed.setTitle('Reminder!')
            embed.setDescription(args.slice(1).join(' '));

            message.author.send(embed);
        }, ms(args[0]));

        embed.setTitle(`<:check_mark:734142905798754394> Reminder has been set`)
        embed.setDescription(`I will remind you in, \`${ms(ms(args[0]), { long: true })}\` through DMS. Make sure it's open!`);

        message.channel.send(embed)
    }
}
