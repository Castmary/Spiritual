const Discord = require("discord.js");
const { utc } = require('moment')
const db = require('quick.db');

module.exports = {
    config: {
        name: "unmute",
        description: "Unmutes the user mentioned that was muted.",
        usage: `unmute <user>`,
        accessableby: "Moderators",
        aliases: [],
        category: "moderation",
    },
    run: async (client, message, args) => {

const embed = client.MessageEmbed(message)

      if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(`${message.author.username}, you need the \`Manage Roles\` permission to execute this command.`)
if (!message.mentions.users.first()) return message.channel.send('Please mention a user to unmute.')

client.createMember(message, message.mentions.users.first().id)

let reason = args.slice(1).join(' ') || 'No reason given'
let member = message.mentions.members.first()
let muterole = message.muterole

if (!muterole) return message.channel.send(embed.setDescription(`Unable to find mute role, please set one using \`${message.prefix}muterole\``))
if (!member.roles.cache.has(muterole.id)) return message.channel.send(`Unable to unmute ${member}, they aren't muted.`)

let unmuteEmbed = new Discord.MessageEmbed()
            .setAuthor('UnMute Moderation', message.author.avatarURL({ dynamic: true, format: 'png' }))
            .setColor(message.color)
            .addField('**User**:', `\`${member.user.tag}\``)
            .addField('**Responsible Moderator**:', `\`${message.author.username}\``)
            .addField('**Date**:', utc(message.createdAt).format('dddd, MMMM Do YYYY'))
message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> ${member} has been unmuted.`))
if (message.log) message.log.send(unmuteEmbed)


db.set(`members.${message.guild.id}.${member.user.id}`, false)
member.roles.remove(muterole.id).catch(() => { })
    }
}
