const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const momentt = require('moment-timezone');

module.exports = {
    config: {
        name: 'time',
        description: 'Displays the time and date at the time of running the command.',
        usage: `time`,
        accessableby: 'Members',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        var today = new Date()

        const embed = new MessageEmbed()
            .setTitle('Time')
            .setDescription(`\`\`\`${moment().utcOffset(-0).format('dddd, MMMM Do YYYY, h:mm:ss a')} UTC\`\`\``)
            .setColor(message.color)
        message.channel.send(embed);
    }
}