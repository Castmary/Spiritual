const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
const youtubeAPI  = require('../../config.json');
const youtube = new Youtube(youtubeAPI.YAPI);
const {MessageEmbed} = require('discord.js')


module.exports = {
    config: {
        name: "play",
        description: "Plays the video you specify in the voice channel the bot is in.",
        usage: `play <video link/name>`,
        accessableby: "Members",
        aliases: [],
        category: "music"
      },
  
      run: async (client, message, args, query) => {
          const embed = new MessageEmbed()
             .setColor(message.color)
             .setAuthor(message.author.username, message.author.avatarURL({dynamic: true}))
          if (!message.dj && client.dj(message, 'play')) return message.channel.send(embed.setDescription(`You need the ${message.djrole || '**DJ**'} role to use this command`))
        
          if (!message.member.voice.channel)
              return message.channel.send(embed.setDescription('You need to be in a voice channel to play music'))
           
          if (client.voice.connections.size > 0)
              if (client.voice.connections.get(message.guild.id).channel !== message.member.voice.channel)
                  return message.channel.send(embed.setDescription('Im already playing music in another voice channel'))

          let song;
          if (client.player.isPlaying(message.guild.id)) song = await client.player.addToQueue(message.guild.id, args.join(' ', message.author.tag))
          else song = await client.player.play(message.member.voice.channel, args.join(' '), message.author.tag)
          if (!song.song) return message.channel.send(embed.setDescription('No song results found, did you check your spelling?'))
          
          let index = client.player.getQueue(message.guild.id).songs.indexOf(song.song) + 1
          
          embed.setThumbnail(song.song.thumbnail)
          embed.addField('Channel', song.song.author.name, true)
          embed.addField('Duration', song.song.duration, true)
          embed.addField('Position', index, true)
          embed.setFooter(`Requested by ${message.author.tag}`)
          
          message.channel.send(embed.setDescription(`${index == 1 ? 'Now playing' : 'Queued'} [${song.song.name}](${song.song.url})`))
          
          song.song.queue.on('end', () => {
              setTimeout(() => {
                if (!client.player.isPlaying(message.guild.id))
                    song.song.queue.connection.channel.leave()
              }, 1800000)
          })
      }
}
