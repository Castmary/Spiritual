const db = require('quick.db')

module.exports = (client, member) => {
    client.createGuild(member.guild.id)
    client.createMember(member.guild.id, member.user.id)
    if (db.get(`members.${member.guild.id}.${member.user.id}.muted`)) member.roles.add(db.get(`${member.guild.id}.muterole`)).catch(() => { })
    let autoroles = db.get(`${member.guild.id}.autoroles`)
    if (autoroles.roles.length && autoroles.enabled)
        for (var role of autoroles.roles)
            if (member.guild.roles.cache.get(role))
                member.roles.add(role)
};