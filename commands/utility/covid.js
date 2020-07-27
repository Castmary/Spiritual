const request = require('request');

module.exports = {
    config: {
        name: "covid",
        description: "Get the latest stats on covid-19",
        usage: ` <country | total>`,
        accessableby: "Members",
        aliases: [],
        category: "utility",
    },
    run: async (client, message, args) => {
    const embed = client.MessageEmbed(message)
    let link;
    
    if (!args[0] || args[0].toLowerCase() == 'total') link = 'https://api.thevirustracker.com/free-api?global=stats'
    else link = `https://api.thevirustracker.com/free-api?countryTotal=${args[0].toUpperCase()}`

    //Get latest covid-19 stats globally or for a country
    request(link, async (error, response, body) => {
        try {
            if (!link.includes('global') && !JSON.parse(body).countrydata) throw new Error
        } catch (e) {
            return message.channel.send(embed.setDescription(`Please use \`-covid <country | total>\`\nFor example: \`-covid US\``))
        }

        //Get data from api 
        let data = JSON.parse(body)
        data = data[Object.keys(data)[0]][0]

        //Set title based on which stats they chose
        embed.setTitle(`${link.includes('global') ? 'World' : data.info.title} Stats for Covid-19`)

        //Delete unneeded data
        if (data.source) delete data.source
        if (data.info) delete data.info

        //Create a field for each set of data
        for (let key in data) embed.addField(key.replace(/_/g, ' '), data[key], true)

        //Send data
        message.channel.send(embed)
    })
    }
}
