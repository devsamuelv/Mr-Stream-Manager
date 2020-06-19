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

const firestore = firebase.firestore();
const discord_2 = "https://discord.gg/rpkp3Tc";
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

client.on('chat', (channel, user, message) => {
    switch (channel) {
        case connected_channels.CodedToGame:
            // * for the coded to game stream
            switch (message) {
                case '!color':
                    var colors = ["blue", "red", "green", "Firebrick", "DodgerBlue", "CadetBlue", "OrangeRed", "HotPink"];

                    var color_num = (Math.floor(Math.random() * Math.max(8)));

                    client.color(colors[color_num]);
                    client.say(channel, `Bot Color Changed to ${colors[color_num]}`);
                    break;

                case '!game':
                    client.say(channel, `Crew and Sam are Playing Minecraft`);
                    break;

                case "!discord":
                    client.say(channel, `Here is the discord ${discord_2} ${user.username}`); 
                    break;
            }
            break;

        case connected_channels.SamuelTheBoi:
            // * for samueltheboi stream
            switch (message) {
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

                case '!color':
                    var colors = ["blue", "red", "green", "Firebrick", "DodgerBlue", "CadetBlue", "OrangeRed", "HotPink"];

                    var color_num = (Math.floor(Math.random() * Math.max(8)));

                    client.color(colors[color_num]);
                    client.say(channel, `Bot Color Changed to ${colors[color_num]}`);
                    break;

                case '!ban':
                    if (user.mod === true) {
                        var input = message.split(' ')[1];
                        if (input.length < 2) return;
                        client.say(channel, `User ${input} was banned`);
                    }
                    break;
            }
            break;

        default:
            console.log("Channel Error <" + channel + ">")
            break;
    }


})

client.once('chat', (channel, user, message) => {
    switch (channel) {
        case connected_channels.SamuelTheBoi:
            if (message.includes("working on") || message.includes("is this")) {
                client.say(channel, `Samuel is working on ${project.name} also the project github ${project.github}`);
            }
            break;
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

client.on('ban', (channel, user, reason) => {
    client.say(channel, `${user} was banned`);
})

client.on('cheer', (channel, userState, message) => {
    if (Number(userState.bits) < 500) {
        // @ts-ignore
        client.vip(channel, userState.username);
    }

    client.say(channel, `Thanks ${userState.username} for the ${userState.bits} bits!!`);

    var data = {
        username: userState.username,
        message: message
    }

    firestore.collection('subgift').add(data).catch((err) => {
        console.error(err);
    })
})

client.on('raided', (channel, username, viewCount) => {
    client.vip(channel, username);

    client.say(channel, `${username} your crazy for raiding with ${viewCount} viewers.`);
})