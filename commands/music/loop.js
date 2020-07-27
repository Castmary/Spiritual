module.exports = {
    config: {
        name: "loop",
        description: "Loops the current song playing on the server",
        usage: `loop`,
        accessableby: "Members",
        aliases: [],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'loop')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
         if (!client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing on the server'));
         
         let song = await client.player.nowPlaying(message.guild.id)
         
         if (song.queue.repeatMode) client.player.setRepeatMode(message.guild.id, false)
         else client.player.setRepeatMode(message.guild.id, true)
      
         message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> ${song.queue.repeatMode ? 'Looping' : 'Disabled loop for'} the current song`))
    }
}