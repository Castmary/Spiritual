module.exports = (client, guild) => {
    console.log(`Left a guild called: ${guild.name}`);
    client.channels.cache.get('724703512310579230').send(`Left Guild: ${guild.name} | ${guild.memberCount} Members `);
};