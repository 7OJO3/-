require('ffmpeg-static');
const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YTDLPlugin } = require('@distube/ytdl');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// إعداد المشغل مع إضافة الـ YTDLPlugin لضمان عمل اليوتيوب
const distube = new DisTube(client, {
    plugins: [new YTDLPlugin()]
});

client.on('ready', () => {
    console.log(`البوت متصل كـ: ${client.user.tag}`);
});

// التعامل مع الأوامر
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.reply('ادخلي قناة صوتية أولاً!');
        
        // إظهار رسالة تفاعل لنتأكد أن البوت سمع الأمر
        message.reply('جاري البحث والتشغيل... 🎵');
        
        distube.play(voiceChannel, args.join(' '), {
            message,
            textChannel: message.channel,
        });
    }
});

client.login(process.env.TOKEN);
