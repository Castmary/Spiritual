const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const ms = require('ms');

module.exports = {
    config: {
        name: 'unlock',
        description: 'Unlocks the channel that was previously locked.',
        usage: 'unlock',
        accessableby: 'Moderators',
        aliases: [],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        const { id } = message.guild.id, // get the ID of defaultRole
            ow = message.channel.permissionOverwrites.get(id); // get the permissionOverwrites fro that role
        const check = message.channel.permissionsFor(message.guild.id).has('SEND_MESSAGES')
        if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(`${message.author.username}, you need the \`Manage Channels\` permission to execute this command.`)

        // If the overwrites exist and SEND_MESSAGES is set to false, then it's already locked
        if (check) return message.channel.send('Channel isnt locked.')
        else {
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });

            const embedunlock1 = new MessageEmbed()
                .setDescription(`<:check_mark:732394061004275715> ${message.channel.name} has been unlocked.`)
                .setColor(message.color)
                .setTimestamp()

            let embedunlock = new MessageEmbed()
                .setAuthor(`Channel Unlocked`, message.guild.iconURL({ dynamic: true, format: 'png' }))
                .setColor(message.color)
                .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
                .addField('**Unlocked Channel**:', message.channel)
                .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))
            message.channel.send(embedunlock1)
            if (message.log) message.log.send(embedunlock)
        }
    }


}