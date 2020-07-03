import * as tmi from 'tmi.js';
import { Client } from 'discord.js';
import * as fs from 'fs';

require('dotenv').config();

const bot = new Client();

const connected_channels = {
    SamuelTheBoi: "SamuelTheBoi",
    CodedToGame: "codedtogame"
}

const channelInfo = {
    discord: {
        samueltheboi: "https://discord.gg/2kuC5zD",
        codedtogame: "https://discord.gg/BE8nDXs",
    },

    steamProfiles: {
        samueltheboi: "https://steamcommunity.com/profiles/76561199029182001/",
        crew: "https://steamcommunity.com/profiles/76561199029182001/",
    },

    github: {
        samueltheboi: "https://github.com/DevSamuelV"
    },

    twitter: {
        SamuelTheBoi: "https://twitter.com/DevSamuel9"
    }
}

const project = {
    github: "https://github.com/DevSamuelV/Mr-Stream-Manager",
    name: "a Twitch Bot Called Mr Stream Manager aka me.",
    full_name: "Samuel is working on a Twitch Bot Called Mr Stream Manager aka me. also the project github https://github.com/DevSamuelV/Mr-Stream-Manager",
    default_name:  "Samuel is working on a Twitch Bot Called Mr Stream Manager aka me. also the project github https://github.com/DevSamuelV/Mr-Stream-Manager"
}

const client = tmi.Client({
    connection: {
        reconnect: true,
        secure: true,
    },

    channels: [connected_channels.SamuelTheBoi, connected_channels.CodedToGame],

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

// * commands
client.on('chat', (channel, user, message) => {

    if (channel.includes("codedtogame")) {
        switch (message) {
            case '!color':
                var colors = ["blue", "red", "green", "Firebrick", "DodgerBlue", "CadetBlue", "OrangeRed", "HotPink"];

                var color_num = (Math.floor(Math.random() * Math.max(8)));

                client.color(colors[color_num]);
                client.say(channel, `Bot Color Changed to ${colors[color_num]}`);
                break;

            case '!ban':
                const messageContent = message.split('ban');

                const username = messageContent[1];
                const banReason = messageContent[2];

                client.ban(channel, username, banReason).then(() => {
                    client.say(channel, `${username} was banned for ${banReason}`);
                }).catch((err) => {
                    client.say(channel, `BOT ERROR: ${err}`);
                    console.error(err);
                })
                break;
        }
    }

    if (channel.includes("samueltheboi")) {
        switch (message) {
            case "!help":
                client.say(channel, "Available Commands !discord, !github, !dice, !project");
                break;

            case "!discord":
                client.say(channel, `Here is the discord ${channelInfo.discord.samueltheboi} ${user.username}`);
                break;

            case '!dice':
                const num = (Math.floor(Math.random() * 6) + 1);
                client.say(channel, `${user.username} you rolled a ${num}`);
                break;

            case '!twitter':
                client.say(channel, channelInfo.twitter.SamuelTheBoi);
                break;

            case "!project":
                client.say(channel, project.full_name);
                break;

            case '!color':
                var colors = ["blue", "red", "green", "Firebrick", "DodgerBlue", "CadetBlue", "OrangeRed", "HotPink"];

                var color_num = (Math.floor(Math.random() * Math.max(8)));

                client.color(colors[color_num]);
                client.say(channel, `Bot Color Changed to ${colors[color_num]}`);
                break;

            case '!ban':
                var args = message.split(' ');
                if (user.mod === true) {
                    if (args[1].length == 0) return;
                    client.ban(channel, args[1], args[2]);
                    client.say(channel, `User ${args[1]} was banned`);
                } else {
                    client.say(channel, `${args[1]} your not moderator`);
                }
                break;
        }
    }
})

client.on('join', (channel, username, isSelf) => {
    switch (username) {
        case 'fierypilot420':
            client.say(channel, `twitchRaid PJSalt PJSalt Lookout ${username} has joined twitchRaid PJSalt PJSalt`);
            break;

        case 'AlbertOverbuild':
            client.say(channel, `twitchRaid PJSalt PJSalt Lookout ${username} has joined twitchRaid PJSalt PJSalt`);
            break;
    }
})

// user chatting
client.on('chat', (channel, user, message) => {
    if (message.includes("working on") && user["display-name"] != "MrStreamManager" || message.includes("is this") && user["display-name"] != "MrStreamManager" || message.includes("whats this") && user["display-name"] != "MrStreamManager" || message.includes("how does it work") && user["display-name"] != "MrStreamManager") {
        client.say(channel, project.full_name);
    }

    if (message.toLowerCase().includes("hello") && user["display-name"] != "MrStreamManager") {
        client.say(channel, `Hello ${user.username} welcome to the stream KappaPride`);
    }

    if (message.includes('!set-cmd') && user.username == "samueltheboi") {
        var message_args = message.split(' ');
        var command_content = message.substr(17);

        if (message_args[1] != '!project') { client.say(channel, 'Commands that can be reset are !project'); return; }
        if (message_args[2].length == 0) { client.say(channel, 'Please specify message content'); return; }

        project.full_name = command_content;

        client.say(channel, "!Project output Updated!");
        console.log(project.name);
    }

    if (message.includes('!revert-cmd') && user.username == "samueltheboi") {
        project.full_name = project.default_name;
        client.say(channel, '!Project Reverted Successfully!');
    }
    // 👨‍💻Calulating volume of an object in python👨‍💻 | !project | !help
})

client.on('subgift', (channel, username, streak, recipients, methods, userstate) => {
    if (streak < 2) {
        client.vip(channel, username);
    }

    client.say(channel, `${username} your crazy for the gifted subs`);

    var data = {
        username: username,
        streak: streak,
        recipients: recipients
    }
})

client.on('resub', (channel, username, months) => {
    if (channel.includes("samueltheboi")) {
        client.say(channel, `twitchRaid Thanks ${username} for resubbing for ${months} twitchRaid`);
    }
})

client.on('hosting', (channel, user, viewCount) => {
    client.say(channel, `Thanks ${user} for hosting with ${viewCount} views.`);
})

client.once('ban', (channel, user, reason) => {
    client.say(channel, `${user} was banned for ${reason}`);
})

client.on('cheer', (channel, userState) => {
    if (Number(userState.bits) < 500) {
        // @ts-ignore
        client.vip(channel, userState.username);
    }

    client.say(channel, `Thanks ${userState.username} for the ${userState.bits} bits!!`);
})

client.on('raided', (channel, username, viewCount) => {
    client.vip(channel, username);

    client.say(channel, `${username} your crazy for raiding with ${viewCount} viewers.`);
})

function parseChannelName(channelName: string) {
    return channelName.split("#")[1];
}


// * discord bot section

const botPrefix = "&";

bot.on('message', (message) => {
    const cmd = message.content.split(botPrefix)[1];

    switch (cmd) {
        case 'github':
            message.channel.send(`Here is Sam's Github ${channelInfo.github.samueltheboi}`);
            break;

        case 'twitter':
            message.channel.send(`Here is Sam's Twitter ${channelInfo.twitter.SamuelTheBoi}`)
            break;
    }
})

bot.login(process.env.DISCORD_TOKEN);