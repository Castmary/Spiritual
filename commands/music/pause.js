module.exports = {
    config: {
        name: "pause",
        description: "Pauses the current song playing on the server",
        usage: `pause`,
        accessableby: "Members",
        aliases: [],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'pause')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
         if (!client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing on the server'));
         
         client.player.pause(message.guild.id)
         message.channel.send(embed.setDescription('<:check_mark:734142905798754394> Paused the current song.'))
    }
}