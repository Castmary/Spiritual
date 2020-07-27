const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'setbotnick',
        description: 'Sets the desired nickname for the bot.',
        usage: 'setbotnick <nickname>',
        accessableby: 'Moderators',
        aliases: [],
        category: 'config',
    },
    run: async (client, message, args) => {
        const nickname = args.join(' ');
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`${message.author.username}, you need the \`Administrator\` permission to execute this command.`);

        if (!nickname) return message.channel.send('Please specify a name you would like me to have.');

        message.guild.me.setNickname(nickname)

        const embed = new MessageEmbed()
            .setDescription(`<:check_mark:734142905798754394> Changed bot's nickname to ${nickname}`)
            .setTimestamp()
            .setColor(message.color)


        const embed1 = new MessageEmbed()
            .setAuthor(`Bot Nickname Change`, message.guild.iconURL({ dynamic: true, format: 'png' }))
            .addField('Previous Nickname', `${message.guild.me.displayName}`)
            .addField('New Nickname', `${nickname}`)
            .addField('Responsible Moderator', `\`${message.author.username}\``)
            .setColor(message.color)

        message.channel.send(embed)

        if (message.log) message.log.send(embed1)
    }
}