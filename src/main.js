const Discord = require('discord.js');
const config = require('config');
const i18n = require("i18n");

const prefix = "/status ";
const client = new Discord.Client();

i18n.configure({
  locales: ['en', 'ja'],
  defaultLocale: config.locale,
  directory: __dirname + '/../locales',
});

client.on('ready', () => {
  console.log(i18n.__('log.login', { user: client.user.tag }));
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (newState.channel === null)
    return;
  if (oldState.channel !== null && oldState.channel.id === newState.channel.id)
    return;
  await Promise.all(config.channels.map(channelData => {
    return (async () => {
      if (newState.guild.id !== channelData.guild)
        return;
      if (newState.channel.id !== channelData.observechannel)
        return;
      if (channelData.observeuser && newState.member.id !== channelData.observeuser)
        return;
      const channel = newState.guild.channels.resolve(channelData.channel);
      channel.send(channelData.message);
    })();
  }));
});

client.login(config.token);