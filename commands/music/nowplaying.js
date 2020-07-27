module.exports = {
    config: {
        name: "nowplaying",
        description: "Dispplays the current song playing on the server",
        usage: `nowplaying`,
        accessableby: "Members",
        aliases: ['np'],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'nowplaying')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
         if (!client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing on the server'));
         
         let song = await client.player.nowPlaying(message.guild.id)

         embed.setThumbnail(song.thumbnail)
         embed.addField('Channel', song.author.name, true)
         embed.addField('Duration', song.duration, true)
         embed.setFooter(`Requested by ${song.requestedBy}`)
      
         message.channel.send(embed.setDescription(`Currently playing: [${song.name}](${song.url})`))
    }
}