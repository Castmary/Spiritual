const { chunk } = require('lodash');

module.exports = {
    config: {
        name: 'banlist',
        description: 'Shows the ban list of the guild.',
        usage: 'banlist',
        accessableby: 'Moderators',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(`${message.author.username}, you need the \`Ban Members\` permission to execute this command.`);

        const bans = chunk((await message.guild.fetchBans()).map(s => s.user.toString()), 30)
        const description = `**Amount of bans**\n${(await message.guild.fetchBans()).size}\n\n**Ban List**\n`
        const embed = client.MessageEmbed(message)
            .setAuthor(`${message.guild.name} Ban List`, message.guild.iconURL({ dynamic: true, format: 'png' }))

        if (bans.length <= 1) return message.channel.send(embed.setDescription(description + bans[0].join(' ')))

        return message.channel.send(embed.setDescription(description + bans[0].join(' '))).then(async emb => {
            ['⏮️', '◀️', '▶️', '⏭️', '⏹️', '🔢'].forEach(async m => await emb.react(m))

            const filter = (_, user) => user.id === message.author.id
            const collector = emb.createReactionCollector(filter, { time: 300000 })
            let page = 1;

            collector.on('collect', async (r, u) => {
                let current = page;
                emb.reactions.cache.get(r.emoji.name).users.remove(u.id)
                if (r.emoji.name === '◀️' && page != 1) page--
                else if (r.emoji.name === '▶️' && page != bans.length) page++
                else if (r.emoji.name === '⏮️') page = 1
                else if (r.emoji.name === '⏭️') page = bans.length
                else if (r.emoji.name === '⏹️') return collector.stop()
                else if (r.emoji.name === '🔢') {
                    let msg = await message.channel.send('What page would you like to flip to?')
                    let collector = await message.channel.awaitMessages(m => m.author.id === message.author.id && m.content > 0 && m.content <= bans.length, { max: 1, time: 8000 })
                    msg.delete().then(() => collector.first().delete())
                    if (collector && collector.first().content > 0 && collector.first().content <= bans.length) page = collector.first().content
                }

                if (current !== page) emb.edit(embed.setDescription(description + bans[page - 1].join(' ')))
            })
        })
    }
}