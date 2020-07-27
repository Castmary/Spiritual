const { generate } = require('random-hex')
const {MessageEmbed} = require('discord.js')
module.exports = {
    config: {
        name: "color",
        description: "Get a random color",
        usage: ``,
        accessableby: "Members",
        aliases: ['randomcolor'],
        category: "utility",
    },
    run: async (client, message, args) => {
    const color = generate()
    
    const embed = new MessageEmbed()
        .setColor(color)
        .setDescription(`**HEX:** \`${color}\`\n**RGB:** \`${client.hexToRgb(color)}\`\n**INT:** \`${parseInt(color.replace('#', ''), 16)}\`\n**HSL:** \`${client.hexToHSL(color)}\``)
        .setThumbnail(`https://colorhexa.com/${color.substr(1)}.png`) //Get the color as an image

    //Send the random color
    message.channel.send(embed)
    
    }
}
