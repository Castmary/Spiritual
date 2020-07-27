const { utc } = require('moment')
const db = require('quick.db');

module.exports = {
    config: {
        name: "warn",
        description: "Gives a warning to the user mentioned.",
        usage: `warning <reason>`,
        accessableby: "Moderators",
        aliases: [],
        category: "moderation",
    },
    run: async (client, message, args) => {
        const embed = client.MessageEmbed(message)
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(embed.setDescription('${message.author.username}, you need the \`Manage Roles\` permission to execute this command.'))
        if (!message.mentions.users.first()) return message.channel.send('Please mention a user to warn.')
        if (message.mentions.users.first() == message.author) return message.channel.send(embed.setDescription('Choose someone to warn other than yourself.'))
        if (!args[1]) return message.channel.send('You have to give a reason for what you\'re warning them for.')

        //Store some info n stuff
        let reason = args.slice(1).join(' ')
        let member = message.mentions.members.first()

        if (!db.get(`members.${message.guild.id}.${member.id}`)) client.createMember(message.guild.id, member.id)
        let warnings = db.get(`members.${message.guild.id}.${member.user.id}.warnings`).length

        //Check if client can ban the member
        if (!member.manageable)
            return message.channel.send('My role requires to be above that user to ban that user')

        //Send message to banned user, catch if not a bot, and send message to channel
        member.send(`You have been warned in ${message.guild.name}.\nReason: ${reason}`).catch(() => { })
        message.channel.send(embed.setDescription(`<:check_mark:732394061004275715> ${member.user.tag} has been warned, this is their ${(warnings + 1) + indicator(warnings + 1)} warning.`))

        //Add warning to members warning list
        db.push(`members.${message.guild.id}.${member.id}.warnings`, { reason: reason, mod: message.author.tag, time: utc(Date.now()).format('ddd, MMM Do, YYYY') })
    }
}

let indicator = i => {
    i = Math.abs(i)
    var cent = i % 100
    if (cent >= 10 && cent <= 20) return 'th'
    var dec = i % 10
    if (dec === 1) return 'st'
    if (dec === 2) return 'nd'
    if (dec === 3) return 'rd'
    return 'th'
}
