const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    config: {
        name: 'help',
        description: 'Provides the available commands.',
        usage: 'help',
        accessableby: 'Members',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        let arr = [];
        let types = ['Config', 'Fun', 'Information', 'Moderation', 'Music', 'Utility'];
        const embed = new MessageEmbed()
        const guild = db.get(message.guild.id)

        if (!args[0]) {
            for (let [key, cmds] of client.categories) embed.addField(types.splice(0, 1), cmds.map(s => `\`${s}\``).join(' '))

            embed.setColor(message.color)
                .setAuthor(`${client.user.username} Help`, message.guild.iconURL())
                .setThumbnail(client.user.displayAvatarURL())
                .setTimestamp()
                .setDescription(`These are the avaliable commands for **${client.user.username}**!\nTo get a more in depth look at commands, do -help (command)\nThe bot prefix is: **${guild.prefix}**`)
                .setFooter(`${client.user.username} Support/Community Server https://discord.gg/sJ2M5kX`, client.user.displayAvatarURL())
            message.channel.send(embed)
        } else {
            let command = client.commands.get(args[0].toLowerCase()) || client.aliases.get(args[0].toLowerCase());
            if (!command) return message.channel.send(`I couldn't find that command, did you check your spelling?`)

            embed.setColor(message.color)
                .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`\n\n**Command:** ${command.config.name}\n**Description:** ${command.config.description || 'No Description'}\n**Usage:** ${command.config.usage || 'No Usage'}\n**Accessable by:** ${command.config.accessableby || 'Members'}\n**Aliases:** ${command.config.aliases.length ? command.config.aliases : 'None'}`)
            message.channel.send(embed);
        }
    }
}
