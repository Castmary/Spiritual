const db = require('quick.db')
module.exports = client => {
    console.log(`${client.user.username} is now online!`);
  
    setInterval(() => {
        let statuses = [`-help | ${client.guilds.cache.size} guilds | Monitoring ${client.users.cache.size} users!`, '#BlackLivesMatter']
        let status = statuses[~~(Math.random() * statuses.length)];
        client.user.setActivity(status, { type: "PLAYING" });
    }, 15000)
  
    setInterval(() => {
        let guild = client.guilds.cache.get('724690404523376771')
        guild.channels.cache.get('736813594838302791').setName(`servers-${client.guilds.cache.size}`)
        guild.channels.cache.get('736813614148747394').setName(`channels-${client.channels.cache.size}`)
        guild.channels.cache.get('736813634415493173').setName(`users-${client.users.cache.size}`)
        guild.channels.cache.get('736813648982573088').setName(`commands-${db.get('commands')}`)
    }, 600000)
}