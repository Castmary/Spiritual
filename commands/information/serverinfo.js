const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { stripIndents } = require('common-tags')
const filterLevels = {
	DISABLED: 'Off',
	MEMBERS_WITHOUT_ROLES: 'No Role',
	ALL_MEMBERS: 'Everyone'
};

const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: '(╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

module.exports = {
	config: {
		name: 'serverinfo',
		aliases: ['serverdesc'],
		usage: 'serverinfo',
		category: 'information',
		description: 'Sends the server\'s information.',
		accessableby: 'Members'
	},
	run: async (client, message, args) => {
		const roles = message.guild.roles.cache
			.filter(r => r.id !== message.guild.id)
			.map(r => r)
			.join(', ');

		let region = {
			'europe': ':flag_eu: Europe',
			'brazil': ':flag_br: Brazil',
			'singapore': ':flag_sg: Singapore',
			'us-central': ':flag_us: U.S. Central',
			'sydney': ':flag_au: Sydney',
			'us-east': ':flag_us: U.S. East',
			'us-south': ':flag_us: U.S. South',
			'us-west': ':flag_us: U.S. West',
			'hongkong': ':flag_hk: Hong Kong',
			'russia': ':flag_ru: Russia',
			'southafrica': ':flag_za:  South Africa'
		};
		if (!message.guild.members.cache.has(message.guild.ownerID)) await message.guild.members.fetch(message.guild.ownerID);

		const embed = new MessageEmbed()
			.setColor(message.color)
			.setAuthor(`${message.guild.name}`, message.guild.iconURL({ format: 'png', dynamic: true }))
			.setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }))
			.addField('**General Information**', stripIndents`**ID:**\`${message.guild.id}\`
			**Creation Date:** \`${moment.utc(message.guild.createdAt).format('MM/DD/YYYY h:mm A')}\`
			**Owner:** \`${message.guild.owner.user.tag}\`
			**Region:** ${region[message.guild.region]}
			**Verification Level:** \`${verificationLevels[message.guild.verificationLevel]}\`
			**Boost Count:** \`${message.guild.premiumSubscriptionCount || 0}\``)
			.addField('**Members Information:**', stripIndents`**Total Members:** \`${message.guild.members.cache.size}\`
			**Humans:** \`${message.guild.members.cache.filter(member => !member.user.bot).size}\`
			**Bots:** \`${message.guild.members.cache.filter(member => member.user.bot).size}\`
			**Online:** \`${message.guild.members.cache.filter(o => o.presence.status === 'online').size}\`
			**Idle:** \`${message.guild.members.cache.filter(o => o.presence.status === 'idle').size}\`
			**Do Not Disturb:** \`${message.guild.members.cache.filter(o => o.presence.status === 'dnd').size}\`
			**Offline:** \`${message.guild.members.cache.filter(o => o.presence.status === 'offline').size}\``)
			.addField('**Channels Information**', stripIndents`**Total Channels:** \`${message.guild.channels.cache.filter(channel => channel.type !== 'category').size}\`
			**Text Channels:** \`${message.guild.channels.cache.filter(ch => ch.type === 'text').size}\`
			**Voice Channels:** \`${message.guild.channels.cache.filter(ch => ch.type === 'voice').size}\``)
			.addField('**Guild\'s Roles ** ', stripIndents`**Roles Count:** \`${message.guild.roles.cache.size}\`
				** Highest Role **: \`${message.guild.roles.highest.name}\`
			**Roles List:** ${message.guild.roles.cache.array().slice(0, 10).map(role => `${role}`).join(' ').replace('@everyone', ' ') + (message.guild.roles.cache.size - 10 > 0 ? ' and ' + (message.guild.roles.cache.size - 10) + ' more roles.' : '')}`)

		return message.channel.send(embed);
	}
}
