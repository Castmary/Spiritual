
module.exports = {
    config: {
        name: "remove",
        description: "Remove a song from the current song playlist at a certain position",
        usage: `remove <song position>`,
        accessableby: "Members",
        aliases: [],
        category: "music",
    },
    run: async (client, message, args) => {
         const embed = client.MessageEmbed(message)
         if (!message.dj && client.dj(message, 'stop')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
         if (!message.guild.me.voice.channel && !client.player.isPlaying(message.guild.id)) return message.channel.send(embed.setDescription('Im not currently playing on the server'));
         if (client.player.isPlaying(message.guild.id)) client.player.stop(message.guild.id)
         if (!args[0] || isNaN(args[0]) || args[0] < 1 || args[0] > client.player.getQueue(message.guild.id).songs.length) return message.channel.send(embed.setDescription('Please choose a valid song number to remove from the queue'))
         client.player.remove(message.guild.id, args[0] - 1)

         message.channel.send(embed.setDescription(`Skipped the current song`))
    }
}
