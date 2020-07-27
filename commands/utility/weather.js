const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    config: {
        name: 'weather',
        description: '',
        usage: 'weather',
        accessableby: 'Members',
        aliases: [],
        category: 'fun',
    },
    run: async (client, message, args) => {
        if (!args[0]) return message.channel.send('Please specify a location.')

        weather.find({ search: args.join(' '), degreeType: 'F' }, function (error, result) {
            if (error) return;
            if (!result) return message.channel.send('Please specify a valid location.')

            var { current, location } = result[0]

            const weatherInfo = new MessageEmbed()
                .setDescription(`${current.skytext}`)
                .setAuthor(`Weather Forecast | ${args[0]}`)
                .setThumbnail(current.imageUrl)
                .setColor(message.color)
                .addField('Timezone', `UTC ${location.timezone}`, true)
                .addField('Degree Type', 'F°', true)
                .addField('Temperature', `${current.temperature}°`, true)
                .addField('Wind', `${current.winddisplay}`, true)
                .addField('Feels like', `${current.feelslike}°`, true)

            message.channel.send(weatherInfo)
        })
    }
}