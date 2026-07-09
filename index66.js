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

const distube = new DisTube(client, { emitNewSongOnly: true });

// عند تشغيل أغنية جديدة
distube.on("playSong", (queue, song) => 
    queue.textChannel.send(`🎶 بدأت الأغنية: **${song.name}**`)
);

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const voiceChannel = message.member.voice.channel;

    if (command === 'play') {
        if (!voiceChannel) return message.reply('يجب أن تكوني في قناة صوتية أولاً!');
        distube.play(voiceChannel, args.join(' '), {
            message,
            textChannel: message.channel,
        });
    }

    if (command === 'skip') {
        const queue = distube.getQueue(message);
        if (queue) {
            queue.skip();
            message.reply('⏭️ تم تخطي الأغنية!');
        } else {
            message.reply('لا يوجد شيء لتخطيه!');
        }
    }

    if (command === 'stop') {
        distube.stop(message);
        message.reply('⏹️ تم إيقاف الموسيقى ومغادرة القناة.');
    }

    if (command === 'volume') {
        const volume = parseInt(args[0]);
        if (isNaN(volume) || volume < 0 || volume > 100) return message.reply('الرجاء تحديد مستوى صوت بين 0 و 100');
        distube.setVolume(message, volume);
        message.reply(`🔊 تم ضبط الصوت على ${volume}%`);
    }
});

client.login(process.env.TOKEN);
