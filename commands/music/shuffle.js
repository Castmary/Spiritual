module.exports = {
    config: {
        name: "shuffle",
        description: "Shuffles the current song playlist on the server",
        usage: `pause`,
        accessableby: "Members",
        aliases: [],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'shuffle')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
         if (!client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing on the server'));
         
         client.player.shuffle(message.guild.id)
         message.channel.send(embed.setDescription('<:check_mark:734142905798754394> Shuffled the current song playlist.'))
    }
}