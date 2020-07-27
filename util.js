const { set, get } = require('quick.db')
const Player = require('./musicdb/Player.js')
const { MessageEmbed } = require('discord.js')

module.exports = client => {
    client.player = new Player(client, 'AIzaSyClTNeTXDOMoxzUie6cY-7TtlnKnov1Ttg', { leaveOnEnd: false, leaveOnStop: false })

    client.trimArray = (arr, max) => {
        return arr.reduce((groups, spot, i) => {
            if (i !== max) groups.push(spot)
            else groups.push(`${arr.length - i} more...`);
            return groups.slice(0, max + 1)
        }, []);
    }

    client.createGuild = (id, message) => {
        delete require.cache[require.resolve('./defaultSettings.json')]
        const defaults = require('./defaultSettings.json')
        settings = set(id, client.merge(defaults, get(id) || {}))

        if (!message) return get(id)
        message.prefix = get(id).prefix
        message.color = ['#fc39f1', 'BLUE'][~~(Math.random() * 2)]
        message.log = message.guild.channels.cache.get(get(id).modlog)
        message.dj = message.member.roles.cache.get(get(id).djrole)
        message.djrole = message.guild.roles.cache.get(get(id).djrole)
        message.prefix = get(id).prefix
        message.muterole = message.guild.roles.cache.get(get(id).muterole)

        return get(id)
    }

    client.createMember = (id, user) => {
        delete require.cache[require.resolve('./memberDefault.json')]
        const defaultm = require('./memberDefault.json')
        if (!get('members')) set('members', {})
        if (!get(`members.${id}.${user}`)) set(`members.${id}.${user}`, defaultm)

        let member = get(`members.${id}.${user}`)
        for (var i in defaultm) if (member.hasOwnProperty(i)) defaultm[i] = member[i]
        set(`members.${id}.${user}`, defaultm)
    }

    client.MessageEmbed = (message) => {
        return new MessageEmbed()
            .setColor(message.color)
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
    }

    client.hexToHSL = H => {
        let r = 0, g = 0, b = 0
        if (H.length == 4) {
            r = '0x' + H[1] + H[1]
            g = '0x' + H[2] + H[2]
            b = '0x' + H[3] + H[3]
        } else if (H.length == 7) {
            r = '0x' + H[1] + H[2]
            g = '0x' + H[3] + H[4]
            b = '0x' + H[5] + H[6]
        }

        r /= 255
        g /= 255
        b /= 255
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0

        if (delta == 0) h = 0
        else if (cmax == r) h = ((g - b) / delta) % 6
        else if (cmax == g) h = (b - r) / delta + 2
        else h = (r - g) / delta + 4

        h = Math.round(h * 60)

        if (h < 0) h += 360

        l = (cmax + cmin) / 2
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
        s = +(s * 100).toFixed(1)
        l = +(l * 100).toFixed(1)

        return h + ', ' + s + '%, ' + l + '%'
    }

    client.hexToRgb = hex => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null
    }

    client.merge = (a, b) => {
        for (let key in a) if (b.hasOwnProperty(key)) a[key] = b[key]
        return a
    }

    client.dj = (message, cmd) => {
        if (get(message.guild.id).dj.includes(cmd)) return true

    }
}
