module.exports = {
    config: {
        name: "clearqueue",
        description: "Clears the servers song queue",
        usage: `clearqueue`,
        accessableby: "Members",
        aliases: ['clearq', 'cq'],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'clearqueue')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command.`))
         if (!client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing anything on the server.'));

         client.player.clearQueue(message.guild.id)
        return message.channel.send(client.MessageEmbed(message).setDescription(`<:check_mark:734142905798754394> Cleared all songs, not including the one currently playing.`))
    }
}