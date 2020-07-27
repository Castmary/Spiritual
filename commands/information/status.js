const { MessageEmbed, version } = require('discord.js');
const moment = require('moment');
const db = require('quick.db');

module.exports = {
    config: {
        name: 'stats',
        description: 'Displays the bot\'s status and information.',
        usage: 'stats',
        accessableby: 'Members',
        aliases: ['status'],
        category: 'information',
    },
    run: async (client, message, args) => {
        const guild = db.get(message.guild.id)
        function duration(ms) {
            const sec = ~~((ms / 1000) % 60)
            const min = ~~((ms / (1000 * 60)) % 60)
            const hrs = ~~((ms / (1000 * 60 * 60)) % 60)
            const days = ~~((ms / (1000 * 60 * 60 * 24)) % 60)
            return `${days ? `${days} days,` : ''}${hrs ? `${hrs} hours, ` : ''}${min ? `${min} minutes, ` : ''}${sec ? `${sec} seconds` : ''}`
        }
        const embed = new MessageEmbed()
            .setColor(message.color)
            .setAuthor(`${client.user.username}'s Status`, client.user.displayAvatarURL({ dynamic: true, format: 'png' }))
            .addField('**Total Users:**', `\`\`\`${client.users.cache.size}\`\`\``, true)
            .addField('**Total Servers:**', `\`\`\`${client.guilds.cache.size}\`\`\``, true)
            .addField('**Total Channels:**', `\`\`\`${client.channels.cache.size}\`\`\``, true)
            .addField('**Text Channels:**', `\`\`\`${client.channels.cache.filter(ch => ch.type === 'text').size}\`\`\``, true)
            .addField('**Voice Channels:**', `\`\`\`${client.channels.cache.filter(ch => ch.type === 'voice').size}\`\`\``, true)
            .addField('**Version:**', `\`\`\`v${version}\`\`\``, true)
            .addField('**Server Prefix:**', `\`\`\`${guild.prefix}\`\`\``, true)
            .addField('**Language:**', `\`\`\`Javascript\`\`\``, true)
            .addField('**Owner:**', `\`\`\`SirGor#0007\`\`\``, true)
            .addField('**Support/Community Server:**', `\`\`\`https://discord.gg/sJ2M5kX\`\`\``, true)
            .addField('**Created At:**', `\`\`\`${moment.utc(client.user.createdAt).format('MM/DD/YYYY h:mm A')}\`\`\``, true)
            .addField('**Uptime:**', `\`\`\`${duration(client.uptime)}\`\`\``)

        message.channel.send(embed)
    }
}
