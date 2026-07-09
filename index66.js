const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const distube = new DisTube(client);

client.on('ready', () => console.log('البوت شغال!'));

client.on('messageCreate', (message) => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'play') {
        distube.play(message.member.voice.channel, args.join(' '), { message, textChannel: message.channel });
    }
});

client.login(process.env.TOKEN);
