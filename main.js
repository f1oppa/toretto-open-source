// built with node v17.6.0, discord.js v13.6.0, axios v0.25.0, dotenv v16.0.0, discord-modals v1.3.7
// by f1oppa

const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Modal, showModal, TextInputComponent } = require('discord-modals');
const discordModals = require('discord-modals');
const axios = require('axios');
require('dotenv').config();

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
});

discordModals(client);

const emojis = {
    arrow: "<:arrow:938138087479988234>",
    error: "<:error:916667788406448148>",
    success: "<:success:904625598557720587>",
    dom: "<:dom:903573294949736478>"
};

const base = process.env.base; // this is the base url for the API

const modal = new Modal()
    .setCustomId('feedback')
    .setTitle('Send feedback')
    .addComponents(  
    new TextInputComponent()
        .setCustomId('feedback-input')
        .setLabel('Feedback')
        .setStyle('LONG')
        .setPlaceholder('Write your feedback here')
        .setRequired(true)
    );

async function isOnList(gid){
    const list = await axios.get(`${base}/list.json`).catch(e => console.log(e));
    for(id in list.data){
        if(list.data[id].server == gid){
            return true
        }
    }
    return false
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    setInterval(function () {
      client.user.setActivity(`${client.guilds.cache.size} servers | /help`, {type: 'WATCHING'});
    }, 1000);
});

client.on('messageCreate', (msg) => {
    if(msg.author == client.user || msg.author.id == "878565026770845766") return;

    const message = msg.content.toLocaleLowerCase();

    if(message.includes("family!help") || message.includes("<@878565026770845766>") || message.includes("<@!878565026770845766>")){
        const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setAuthor({ name: 'Commands:', iconURL: msg.author.displayAvatarURL()})
        .addFields(
            { name: 'Fun commands', value: 'You can use these commands without a prefix.' },
            { name: 'family', value: `${emojis.arrow} replies with: Did someone say... FAMILY?!`},
            { name: 'stfu toretto', value: `${emojis.arrow} replies with a youtube video`},
            { name: 'toretto??', value: `${emojis.arrow} reacts with an emoji`},
        )
        .addFields(
            { name: 'Welcome system', value: 'With these commands you can set the bot to welcome new members.' },
            { name: 'family!setwelcome', value: `${emojis.arrow} Sets the welcome system.`},
            { name: 'family!delwelcome', value: `${emojis.arrow} Removes the welcome system.`}
        )
        .setFooter({ text: 'Dominic Toretto bot', iconURL: 'https://cdn.discordapp.com/avatars/878565026770845766/8547398e183aa768553a2ffc5ccf7413.webp' })
        .setTimestamp();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Invite')
                    .setStyle('LINK')
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=878565026770845766&permissions=274878171200&scope=bot%20applications.commands"),
                new MessageButton()
                    .setLabel('Support server')
                    .setStyle('LINK')
                    .setURL("https://discord.gg/Bbrm4wtaKu")
            );
    
        return msg.channel.send({ embeds: [embed], components: [row] });   
    }

    if(message.includes("family!setwelcome")){
        if(!msg.member.permissionsIn(msg.channel).has("ADMINISTRATOR")){
            return msg.reply(`${emojis.error} You need \`Administrator\` permissions to use this command.`)
        }

        isOnList(msg.guildId).then((res) => {
            if(res){
                return msg.reply(`${emojis.error} The welcome system has been already set up on this server.`)
            }
            else{
                axios.get(`${base}/add.php`, {
                    headers: {
                        server: msg.guildId,
                        channel: msg.channelId
                    }
                }).then(function (res) {
                    if(res.status == 200){
                        return msg.reply(`${emojis.success} The welcome system has been set up in <#${msg.channelId}>!`)
                    }
                    else{
                        return msg.reply(`${emojis.error} We can't handle this command at this moment. (Server responded with ${res.status})`)
                    }
                })
            }
        })
        return;
    }

    if(message.includes("family!delwelcome")){
        if(!msg.member.permissionsIn(msg.channel).has("ADMINISTRATOR")){
            return msg.reply(`${emojis.error} You need \`Administrator\` permissions to use this command.`)
        }

        isOnList(msg.guildId).then((res) => {
            if(res){
                axios.get(`${base}/remove.php`, {
                    headers: {
                        server: msg.guildId
                    }
                }).then(function (res) {
                    if(res.status == 200){
                        return msg.reply(`${emojis.success} The welcome system has been successfully removed!`)
                    }
                    else{
                        return msg.reply(`${emojis.error} We can't handle this command at this moment. (Server responded with ${res.status})`)
                    }
                })
            }
            else{
                return msg.reply(`${emojis.error} There is not a single welcome channel configured on this server.`)
            }
        })
        return
    }
    
    if(message.includes("family!ping")){
        return msg.reply(`Pong! ${Math.round(client.ws.ping)}ms`);
    }
    if(message.includes("család a legfontosabb") || message.includes("family is important")){
        return msg.react("👌")
    }
    else if(message.includes("toretto??") || message.includes("toretto?!")){
        return msg.react("👀")
    }
    else if(message.includes("stfu toretto") || message.includes("kuss toretto")){
        return msg.channel.send("https://www.youtube.com/watch?v=OLpeX4RRo28")
    }

    if(message.includes("family")){
        return msg.channel.send("Did someone said... FAMILY?!")
    }
    else if(message.includes("család"))
        return msg.channel.send("Valaki azt mondta hogy... CSALÁD?!")
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply(`Pong! ${Math.round(client.ws.ping)}ms`);
    }
    if (interaction.commandName === 'help') {
        const embed = new MessageEmbed()
	.setColor('#ff0000')
	.setAuthor({ name: 'Commands:', iconURL: interaction.user.displayAvatarURL()})
	.addFields(
	    { name: 'Fun commands', value: 'You can use these commands without a prefix.' },
	    { name: 'family', value: `${emojis.arrow} replies with: Did someone say... FAMILY?!`},
	    { name: 'stfu toretto', value: `${emojis.arrow} replies with a youtube video`},
	    { name: 'toretto??', value: `${emojis.arrow} reacts with an emoji`},
	)
	.addFields(
	    { name: 'Welcome system', value: 'With these commands you can set the bot to welcome new members.' },
	    { name: 'family!setwelcome', value: `${emojis.arrow} Sets the welcome system.`},
	    { name: 'family!delwelcome', value: `${emojis.arrow} Removes the welcome system.`}
	)
	.setFooter({ text: 'Dominic Toretto bot', iconURL: 'https://cdn.discordapp.com/avatars/878565026770845766/8547398e183aa768553a2ffc5ccf7413.webp' })
	.setTimestamp();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Invite')
                    .setStyle('LINK')
                    .setURL("https://discord.com/api/oauth2/authorize?client_id=878565026770845766&permissions=274878171200&scope=bot%20applications.commands"),
                new MessageButton()
                    .setLabel('Support server')
                    .setStyle('LINK')
                    .setURL("https://discord.gg/Bbrm4wtaKu")
            );
        
        await interaction.reply({ embeds: [embed], components: [row] });
    }
    if (interaction.commandName === 'feedback'){
    	showModal(modal, {
            client: client,
            interaction: interaction
        })
    }
});

client.on('guildMemberAdd', async (guildMember) => {
    const list = await axios.get(`${base}/list.json`).catch(e => console.log(e));
    for(id in list.data){
        if(list.data[id].server == guildMember.guild.id){
            return client.channels.cache.get(list.data[id].channel).send(`${emojis.dom} Welcome <@${guildMember.id}> on this server!`)
        }
    }
});

client.on('modalSubmit', async (modal) => {
  if(modal.customId === 'feedback') {
    const feedback = modal.getTextInputValue('feedback-input');
	  
    axios.post(process.env.feedback, {
        "embeds": [
                {
                    "color": 420101, 
                    "author": {"name": modal.user.id,"icon_url": modal.user.displayAvatarURL()},
                    "fields": 
                    [
                        {"name": "Feedback", "value": feedback}
                    ]
                }
            ]
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(e => console.log("prevented from crashing"));
	 
    if(feedback.length < 1000){
    	modal.reply({ content: "Thank you for your feedback! We will reply soon if needed!", ephemeral: true });
    }
    else{
    	modal.reply({ content: "Please make your feedback a bit shorter.", ephemeral: true })
    }
  }
});

client.login(process.env.token);
