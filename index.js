const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates, DirectMessages, GuildMessageReactions, GuildEmojisAndStickers, GuildWebhooks, GuildIntegrations, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, GuildScheduledEvent, Reaction } = Partials;

const client = new Client({ intents: 3276799, partials: [User, Message, GuildMember, ThreadMember, GuildScheduledEvent, Reaction] });

/* Packages */
const fs = require("fs");
const ms = require("ms");

/* Configuration */
client.config = require('./SRC/JSON/config.json');
const { botMainColor, botErrorColor , prefix } = require('./SRC/JSON/config.json');

/* Embed Colors */
client.mainColor = parseInt(botMainColor);
client.errorColor = parseInt(botErrorColor);

client.hexMainColor = botMainColor.replace('0x', "#");
client.hexErrorColor = botErrorColor.replace('0x', "#");

/* Music System */
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');

client.distube = new DisTube(client, {
    leaveOnEmpty: true,
    nsfw: true,
    emitNewSongOnly: true,
    leaveOnFinish: true,
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()]
})
module.exports = client;

/* Mod Logs */
const modlogsDB = require('./SRC/models/ModerationLogs');
client.modlogs = async function({ Member, Action, Color, Reason }, interaction) {
    const data = await modlogsDB.findOne({ GuildID: interaction.guild.id })
    if (!data) return;

    const channel = interaction.guild.channels.cache.get(data.ChannelID);
    const logsEmbed = new EmbedBuilder()
        .setColor(Color)
        .setAuthor({ name: Member.user.tag, iconURL: Member.user.displayAvatarURL() })
        .setTitle("📕 Moderation Logs")
        .addFields([
            { name: "Reason", value: `${Reason || "No reason given"}`, inline: false },
            { name: "Member", value: `<@${Member.id}>`, inline: false }])
        .setFooter({ text: `Action: ${Action}` })

    channel.send({ embeds: [logsEmbed] });
}

client.voiceGenerator = new Collection();
client.commands = new Collection();
client.modals = new Collection();
client.buttons = new Collection();

const { loadEvents } = require('./SRC/Handlers/Events');
const { loadCommands } = require('./SRC/Handlers/Commands');
const { loadSlashCommands } = require('./SRC/Handlers/SlashCommands');

client.login("TOKEN BOT").then(() => {
    loadEvents(client);
    loadCommands(client);
    loadSlashCommands(client);
});