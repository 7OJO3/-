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

// إعداد DisTube بدون أي خيارات معقدة لتجنب الأخطاء
const distube = new DisTube(client);

client.on('ready', () => {
    console.log(`البوت شغال كـ: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.reply('ادخلي قناة صوتية أولاً!');
        
        distube.play(voiceChannel, args.join(' '), {
            message,
            textChannel: message.channel,
        });
    }

    if (command === 'skip') {
        const queue = distube.getQueue(message);
        if (queue) {
            queue.skip();
            message.reply('⏭️ تم التخطي!');
        }
    }

    if (command === 'stop') {
        distube.stop(message);
        message.reply('⏹️ تم الإيقاف.');
    }
});

client.login(process.env.TOKEN);
