require("dotenv").config()
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
	new SlashCommandBuilder().setName('help').setDescription('Shows the list of the commands'),
    new SlashCommandBuilder().setName('ping').setDescription('Shows the bots response type'),
    new SlashCommandBuilder().setName('feedback').setDescription('Sends a feedback to the developers')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.token);

rest.put(Routes.applicationCommands("878565026770845766"), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);