const { chunk } = require('lodash')

module.exports = {
    config: {
        name: 'emojilist',
        description: 'Lists the guild\'s emojis.',
        usage: 'emojilist',
        accessableby: 'Members',
        aliases: [],
        category: 'information',
    },
    run: async (client, message, args) => {
        let emojis = chunk(message.guild.emojis.cache.map(emoji => emoji.toString()), 35)
        const description = `**Amount of Emojis**\n${message.guild.emojis.cache.size}\n\n**Emoji List**\n`
        const embed = client.MessageEmbed(message)
            .setAuthor(`${message.guild.name} Emoji List`, message.guild.iconURL({ dynamic: true, format: 'png' }))

        if (emojis.length <= 1) return message.channel.send(embed.setDescription(description + emojis[0].join(' ')))

        return message.channel.send(embed.setDescription(description + emojis[0].join(' '))).then(async emb => {
            ['⏮️', '◀️', '▶️', '⏭️', '⏹️', '🔢'].forEach(async m => await emb.react(m))

            const filter = (_, user) => user.id === message.author.id
            const collector = emb.createReactionCollector(filter, { time: 300000 })
            let page = 1;

            collector.on('collect', async (r, u) => {
                let current = page;
                emb.reactions.cache.get(r.emoji.name).users.remove(u.id)
                if (r.emoji.name === '◀️' && page != 1) page--
                else if (r.emoji.name === '▶️' && page != emojis.length) page++
                else if (r.emoji.name === '⏮️') page = 1
                else if (r.emoji.name === '⏭️') page = emojis.length
                else if (r.emoji.name === '⏹️') return collector.stop()
                else if (r.emoji.name === '🔢') {
                    let msg = await message.channel.send('What page would you like to flip to?')
                    let collector = await message.channel.awaitMessages(m => m.author.id === message.author.id && m.content > 0 && m.content <= emojis.length, { max: 1, time: 8000 })
                    msg.delete().then(() => collector.first().delete())
                    if (collector && collector.first().content > 0 && collector.first().content <= emojis.length) page = collector.first().content
                }

                if (current !== page) emb.edit(embed.setDescription(description + emojis[page - 1].join(' ')))
            })
        })
    }
}