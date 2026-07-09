const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');

// 1. إعدادات البوت الأساسية (يجب أن يكون client في البداية)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 2. إعداد DisTube (مرة واحدة فقط وبدون searchSongs التي تسبب خطأ)
const distube = new DisTube(client, { 
    emitNewSongOnly: true 
});

const VOICE_CHANNEL_ID = '1524788602582597904';

client.on('ready', () => {
    console.log(`البوت شغال كـ: ${client.user.tag}`);
    
    // الانضمام التلقائي
    const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
    if (channel) {
        distube.voices.join(channel);
        console.log("تم الانضمام للقناة الصوتية بنجاح!");
    } else {
        console.log("خطأ: تأكدي من ID القناة!");
    }
});

// 3. نظام الأوامر
client.on('messageCreate', (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
        if (!channel) return message.reply('القناة الصوتية غير موجودة!');
        distube.play(channel, args.join(' '), { message });
    }

    if (command === 'skip') {
        distube.skip(message);
        message.reply('تم التخطي! ⏭️');
    }

    if (command === 'stop') {
        distube.stop(message);
        message.reply('تم الإيقاف! ⏹️');
    }
});

client.login(process.env.TOKEN);
