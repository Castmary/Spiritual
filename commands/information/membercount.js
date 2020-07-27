const { MessageEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'membercount',
        description: 'Shows the membercount of the guild.',
        usage: 'membercount',
        accessableby: 'Members',
        aliases: ['serverinfo'],
        category: 'information',
    },
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setAuthor(`${message.guild.name}`, message.guild.iconURL({ format: 'png', dynamic: true }))
            .addField('Members', `${message.guild.memberCount}`, true)
            .addField('Bots', `${message.guild.members.cache.filter(m => m.user.bot).size}`, true)
            .addField('Members Online', `<:discord_online:721253458526732348> ${message.guild.members.cache.filter(m => m.presence.status === 'online').size}`)
            .addField('Members DND', `<:discord_dnd:721253956658921565> ${message.guild.members.cache.filter(m => m.presence.status === 'dnd').size}`)
            .addField('Members Idle', `<:discord_idle:721253701867536404> ${message.guild.members.cache.filter(m => m.presence.status === 'idle').size}`)
            .addField('Members Invisible/Offline', `<:discord_offline:721253772663324713> ${message.guild.members.cache.filter(m => m.presence.status === 'offline').size}`)
            .setColor(message.color)
        message.channel.send(embed);



    }
}
