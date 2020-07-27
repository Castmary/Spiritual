const { MessageEmbed } = require('discord.js');
const colored = ['#da7272', '#da8f72', '#daab72', '#dac272', '#dad872', '#c0da72', '#a9da72', '#8cda72', '#72da75', '#72da95', '#72dab6', '#72dacc', '#72d5da', '#72b6da', '#7296da', '#7274da', '#9172da', '#ab72da', '#bd72da', '#d172da', '#da72c5', '#da72ab', '#da7298'];
const moment = require('moment');

module.exports = {
    config: {
        name: 'userinfo',
        description: 'Sends the author or the mentioned user\'s info.',
        usage: `userinfo <@user>`,
        accessableby: 'Members',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.author;

        const userFlags = user.flags.toArray();
        const embed = new MessageEmbed()
            .setThumbnail(user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setAuthor(`${user.tag}`, user.displayAvatarURL({ format: 'png', dynamic: true }))
            .addField('**Discord Join Date**', `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY')}`, true)
            .addField('**ID**', user.id, true)
            .addField('**User Type**', user.bot ? 'Bot' : 'User', true)

        if (message.guild) {
            try {
                const member = await message.guild.members.fetch(user.id);
                const defaultRole = message.guild.roles.cache.get(message.guild.id);
                const roles = member.roles.cache
                    .filter(r => r.id !== message.guild.id)
                    .map(r => r)
                    .join(' ') || 'none';
                embed
                    .addField('**Nickname**', `${member.nickname ? `${member.nickname}` : 'None'}`, true)
                    .addField('**Server Join Date**', moment.utc(member.joinedAt).format('dddd, Do MMMM YYYY, '), true)
                    .addField('**Highest Role**', member.roles.highest.id === defaultRole.id ? 'None' : member.roles.highest.name, true)
                    .addField(`**Roles**`, roles)
                    .setColor(message.color);
            } catch {
                embed.setFooter('Failed to resolve member, showing basic user information instead.');
            }
        }
        return message.channel.send(embed);
    }

}
