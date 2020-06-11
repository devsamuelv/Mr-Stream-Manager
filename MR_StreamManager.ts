import * as tmi from 'tmi.js';
import { Client } from 'discord.js';
import * as fs from 'fs';

require('dotenv').config();

const discord_bot = new Client();
const discord = "https://discord.com/invite/TD8Dcsb";
const github = "https://github.com/DevSamuelV";
const project = {
    github: "https://github.com/DevSamuelV/Mr-Stream-Manager",
    name: "a Twitch Bot Called Mr Stream Manager aka me."
}

const client = tmi.Client({
    connection: {
        reconnect: true,
        secure: true,
    },

    channels: ["samueltheboi"],

    identity: {
        username: "MrStreamManager",
        password: process.env.OAUTH
    },

    options: {
        clientId: process.env.CLIENT_ID,
        debug: true,
    }
})

console.log(client.connect());

client.on('chat', (channel, user, message) => {
    switch(message) {
        case "!help":
            client.say(channel, "Available Commands !discord, !github, !dice, !project");
            break;

        case "!discord":
            client.say(channel, `Here is the discord ${discord} ${user.username}`);
            break;

        case '!dice':
            const num = (Math.floor(Math.random() * 6) + 1);
            client.say(channel, `${user.username} you rolled a ${num}`);
            break;

        case '!github':
            client.say(channel, github);
            break;

        case "!project":
            client.say(channel, `Samuel is working on ${project.name} also the project github ${project.github}`);
            break;
    }
})

client.once('chat', (channel, user, message) => {
    if (message.includes("working on") || message.includes("is this")) {
        client.say(channel, `Samuel is working on ${project.name} also the project github ${project.github}`);
    }
})

client.on('subgift', (channel, username, streak, recipients, methods, userstate) => {
    if (streak < 2) {
        client.vip(channel, username);
    }

    client.say(channel, `${username} your crazy for the gifted subs`);
})

client.on('hosting', (channel, user, viewCount) => {
    client.say(channel, `Thanks ${user} for hosting with ${viewCount} views.`);
})

client.on('ban', (channel, user, reason) => {
    client.say(channel, `${user} was banned`);
})

client.on('cheer', (channel, userState, message) => {
    if (Number(userState.bits) < 500) {
        // @ts-ignore
        client.vip(channel, userState.username);
    }

    client.say(channel, `Thanks ${userState.username} for the ${userState.bits} bits!!`);
})