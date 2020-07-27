const {chunk} = require('lodash')

module.exports = {
    config: {
        name: "queue",
        description: "View the song queue for this server",
        usage: `queue`,
        accessableby: "Members",
        aliases: ['q'],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'queue')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
         if (!client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing on the server'));

         let list = chunk(client.player.getQueue(message.guild.id).songs.map((q, i) => `${i + 1}) ${q.name.length > 60 ? q.name.slice(0, 60) + '...' : q.name} - ${q.duration}`), 5)
         
         if (list.length <= 1) return message.channel.send(embed.setDescription(list[0].join('\n')))

         return message.channel.send(embed.setDescription(list[0].join('\n'))).then(async emb => {
             ['⏮️', '◀️', '▶️', '⏭️', '⏹️', '🔢'].forEach(async m => await emb.react(m))

             const filter = (_, user) => user.id === message.author.id
             const collector = emb.createReactionCollector(filter, { time: 300000 })
             let page = 1

             //If they react, edit the embed
             collector.on('collect', async (r, u) => {
                 let current = page;
                 emb.reactions.cache.get(r.emoji.name).users.remove(u.id)
                 if (r.emoji.name === '◀️' && page != 1) page--
                 else if (r.emoji.name === '▶️' && page != list.length) page++
                 else if (r.emoji.name === '⏮️') page = 1
                 else if (r.emoji.name === '⏭️') page = list.length
                 else if (r.emoji.name === '⏹️') return collector.stop()
                 else if (r.emoji.name === '🔢') {
                     let msg = await message.channel.send('What page would you like to flip to?')
                     let collector = await message.channel.awaitMessages(m => m.author.id === message.author.id && m.content > 0 && m.content <= list.length, { max: 1, time: 8000 })
                     msg.delete().then(() => message.delete())
                     if (collector && collector.first().content > 0 && collector.first().content <= list.length) page = collector.first().content
                 }
                 if (current !== page) emb.edit(embed.setDescription(`${list[page - 1].join('\n')}`))
             })
         })
    }
}