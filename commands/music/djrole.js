const { MessageEmbed } = require("discord.js");
const db = require('quick.db')

module.exports = {
    config: {
        name: "djrole",
        description: "Set the servers dj role to allow certain users to access all music commands",
        usage: `djrole`,
        accessableby: "Members",
        aliases: [],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
             .setDescription(`This servers dj role: ${message.djrole || 'none'}`)
             
         if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(embed.setDescription('You dont have permissions to use this command.'))
         if (!args[0] || !['set', 'disable'].includes(args[0])) return message.channel.send(embed.setDescription(`${embed.description}\n\nPlease use \`-djrole <set | disable> [role]\``))
         if (args[0] == 'set' && !message.mentions.roles.first()) return message.channel.send(embed.setDescription('Please mention a role to set the dj role to.'))
         if (args[0] == 'disable' && !message.djrole) return message.channel.send(embed.setDescription('I couldnt find this servers dj role'))
         
         let role = message.mentions.roles.first() || 'none'

         if (role !== 'none') message.channel.send(embed.setDescription(`Members with the ${role.toString()} role now have permissions for all music commands`))
         else message.channel.send(embed.setDescription('<:check_mark:734142905798754394> Successfully disabled the dj role.'))
      
         db.set(`${message.guild.id}.djrole`, role == 'none' ? role : role.id)
    }
}