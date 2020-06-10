import * as tmi from 'tmi.js';

require('dotenv').config();

const discord = "https://discord.com/invite/TD8Dcsb";
const github = "https://github.com/DevSamuelV";
let project_name = "Twitch Bot Called Mr Stream Manager";

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
        case "!discord":
            client.say(channel, `Here is the discord ${discord} ${user.username}`);
            break;

        case '!ban':
            if (!user.mod) { client.say(channel, `${user.username} you dont have that permission`); return; }

            if (user.mod) {
                
            }
            break;

        case '!github':
            client.say(channel, github);
            break;

        case "!project":
            client.say(channel, `Samuel is working on a project called ${project_name}`);
            break;
    }
})
