const Discord = require('discord.js');
const ms = require('ms');
const moment = require('moment');

module.exports = {
    config: {
        name: 'lock',
        description: 'Locks the channel.',
        usage: 'lock',
        accessableby: 'Moderators',
        aliases: [],
        category: 'moderation',
    },
    run: async (client, message, args) => {
        let { id } = message.guild.id, // get the ID of defaultRole
            ow = message.channel.permissionOverwrites.get(id); // get the permissionOverwrites fro that role
        const permsInChannel = message.channel.permissionsFor(message.guild.id);
        const check = permsInChannel.has('SEND_MESSAGES');
        if (!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send(`${message.author.username}, you need the \`Manage Channels\` permission to execute this command.`)
        // If the overwrites exist and SEND_MESSAGES is set to false, then it's already locked
        if (!check) return message.channel.send('This channel is already locked.');
        else {
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
            let embedlock = new Discord.MessageEmbed()
                .setAuthor(`Channel Locked`, message.guild.iconURL({ dynamic: true, format: 'png' }))
                .setColor(message.color)
                .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
                .addField('**Locked Channel**:', message.channel)
                .addField('**Date**:', moment.utc(message.createdAt).format('dddd, MMMM Do YYYY'))

            message.channel.send(embedlock)
            if (message.log) message.log.send(embedlock)
        }
    }


}