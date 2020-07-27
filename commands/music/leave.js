module.exports = {
    config: {
        name: "leave",
        description: "Stops the music playing on the server and leaves the channel",
        usage: `leave`,
        accessableby: "Members",
        aliases: ['stop'],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'stop')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
         if (!message.guild.me.voice.channel && !client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing on the server'));
         if (client.player.isPlaying(message.guild.id)) client.player.stop(message.guild.id)
         message.guild.me.voice.channel.leave()
         message.channel.send(embed.setDescription('<:check_mark:734142905798754394> I\'ve left the voice channel.'))
    }
}
