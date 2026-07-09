require('ffmpeg-static');
const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// إعداد DisTube بسيط جداً
const distube = new DisTube(client);

client.on('ready', () => {
    console.log(`البوت متصل كـ: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.reply('يجب أن تكوني في قناة صوتية أولاً!');
        
        distube.play(voiceChannel, args.join(' '), {
            message,
            textChannel: message.channel,
        });
    }
});

client.login(process.env.TOKEN);
