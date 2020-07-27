module.exports = (client, guild) => {
    client.createGuild(guild.id)
    console.log(`Joined a new guild called: ${guild.name}`);
    client.channels.cache.get('724690529157120322').send(`Joined Guild: ${guild.name} | ${guild.memberCount} Members `);
};
