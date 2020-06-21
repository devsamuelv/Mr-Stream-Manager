import * as tmi from 'tmi.js';
import * as firebase from 'firebase';
import { Client } from 'discord.js';
import * as fs from 'fs';

require('dotenv').config();
firebase.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.messagingSenderId,
    appId: process.env.appId
})

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
    }
}

const firestore = firebase.firestore();

const project = {
    github: "https://github.com/DevSamuelV/Mr-Stream-Manager",
    name: "a Twitch Bot Called Mr Stream Manager aka me."
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

            // case '!github':
            //     client.say(channel, channelInfo.github.samueltheboi);
            //     break;

            case "!project":
                client.say(channel, `Samuel is working on ${project.name} also the project github ${project.github}`);
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
client.once('chat', (channel, user, message) => {
    if (message.includes("working on") || message.includes("is this") || message.includes("whats this") || message.includes("how does it work")) {
        client.say(channel, `Samuel is working on ${project.name} also the project github ${project.github}`);
    }

    if (message.toLowerCase().includes("hello")) {
        client.say(channel, `Hello ${user.username} welcome to the stream KappaPride`);
    }
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

    firestore.collection('subgift').add(data).catch((err) => {
        console.error(err);
    })
})

client.on('hosting', (channel, user, viewCount) => {
    client.say(channel, `Thanks ${user} for hosting with ${viewCount} views.`);
})

client.once('ban', (channel, user, reason) => {
    client.say(channel, `${user} was banned`);
})

client.on('cheer', (channel, userState, message) => {
    if (Number(userState.bits) < 500) {
        // @ts-ignore
        client.vip(channel, userState.username);
    }

    client.say(channel, `Thanks ${userState.username} for the ${userState.bits} bits!!`);

    // var data = {
    //     username: userState.username,
    //     message: message
    // }

    // firestore.collection('subgift').add(data).catch((err) => {
    //     console.error(err);
    // })
})

client.on('raided', (channel, username, viewCount) => {
    client.vip(channel, username);

    client.say(channel, `${username} your crazy for raiding with ${viewCount} viewers.`);
})

function parseChannelName(channelName: string) {
    return channelName.split("#")[1];
}