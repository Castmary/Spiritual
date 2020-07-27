module.exports = {
    config: {
        name: "volume",
        description: "Change the volume of the current song playing on the server",
        usage: `volume`,
        accessableby: "Members",
        aliases: [],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'volume')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
         if (!client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing on the server'));
         if (isNaN(parseInt(args[0])) || parseInt(args[0]) <= 0 || parseInt(args[0]) > 300) return message.channel.send(embed.setDescription('Please choose a volume between 1 and 300 for your current song\nEach songs default volume is 100%'))
      
         client.player.setVolume(message.guild.id, parseInt(args[0]))
         message.channel.send(embed.setDescription(`<:check_mark:734142905798754394> Set the current songs volume to ${parseInt(args[0])}%.`))
    }
}