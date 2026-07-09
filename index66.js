require('ffmpeg-static'); // لضمان عمل معالجة الصوت
const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');

// إعداد صلاحيات البوت للوصول للرسائل والقنوات الصوتية
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// إعداد محرك الموسيقى
const distube = new DisTube(client, { 
    emitNewSongOnly: true,
    leaveOnEmpty: true,
    leaveOnFinish: true
});

const VOICE_CHANNEL_ID = '1524788602582597904';

// حدث عند جاهزية البوت
client.on('ready', () => {
    console.log(`البوت شغال كـ: ${client.user.tag}`);
    
    // محاولة الانضمام للروم التلقائي
    const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
    if (channel) {
        distube.voices.join(channel)
            .then(() => console.log("تم الانضمام للقناة الصوتية بنجاح!"))
            .catch(err => console.error("فشل الانضمام للقناة:", err));
    } else {
        console.log("خطأ: لا يمكن العثور على القناة الصوتية بالـ ID المحدد.");
    }
});

// نظام الأوامر
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // أمر التشغيل
    if (command === 'play') {
        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.reply('يجب أن تكوني في قناة صوتية أولاً!');
        
        distube.play(voiceChannel, args.join(' '), {
            message,
            textChannel: message.channel,
        });
    }

    // أمر التخطي
    if (command === 'skip') {
        const queue = distube.getQueue(message);
        if (queue) {
            queue.skip();
            message.reply('⏭️ تم تخطي الأغنية!');
        } else {
            message.reply('لا يوجد شيء لتخطيه!');
        }
    }

    // أمر الإيقاف
    if (command === 'stop') {
        distube.stop(message);
        message.reply('⏹️ تم إيقاف الموسيقى.');
    }
});

// تسجيل الدخول باستخدام التوكين المحفوظ في إعدادات النظام
client.login(process.env.TOKEN);
