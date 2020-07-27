const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'avatar',
        description: 'Shows the profile picture of the mentioned user. (Or your\'s)',
        usage: 'avatar | <@user>',
        accessableby: 'Members',
        aliases: ['av', 'profilepic'],
        category: 'information',
    },
    run: async (client, message, args) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        let avatar = member.user.avatarURL({ size: 4096, dynamic: true });

        const embed = new MessageEmbed()
            .setTitle(`${member.user.tag} avatar`)
            .setDescription(`[Avatar URL of **${member.user.tag}**](${avatar})`)
            .setColor(message.color)
            .setImage(avatar)

        return message.channel.send(embed);
    }
}
