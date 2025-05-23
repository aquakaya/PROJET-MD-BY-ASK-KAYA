import { handleMenu } from '../commands/queen.js';
import { ping } from '../commands/ping.js';
import { rubyCrashUI } from './rubyCrashUI.js';
import { connect } from '../commands/connect.js';
import { disconnect } from '../commands/disconnect.js';

async function messageHandler(message, client) {
    const { command, parts, number } = parseMessage(message);
    const premiumUsers = ['premium_user1@s.whatsapp.net', 'premium_user2@s.whatsapp.net']; 

    if (config.ANTI_SPAM) {
    }

    if (config.AUTO_READ) {
        await client.sendReadReceipt(message.key.remoteJid, message.key.participant, [message.key.id]);
    }

    if (config.AUTO_TYPING) {
        await client.sendPresenceUpdate('composing', message.key.remoteJid);
    }

    if (config.AUTO_RECORDING) {
        await client.sendPresenceUpdate('recording', message.key.remoteJid);
    }

    if (config.AUTO_REACT) {
        await react(message, client, '👍');
    }

    switch (command) {
        case 'connect':
            const target = parts[1];
            await react(message, client, '🍷');

            if (premiumUsers.includes(number)) {
                try {
                    await connect.connect(message, client, target);
                } catch (error) {
                    await client.sendMessage(message.key.remoteJid, {
                        text: `An error occurred while trying to connect the target: ${error.message}`
                    });
                    console.error("Error in connect command:", error);
                }
            } else {
                await client.sendMessage(message.key.remoteJid, {
                    text: "This command is only for premium users. Contact Dev Danscot Senku to become premium."
                });
            }
            break;

        case 'ping':
            await react(message, client, '🌟');
            await ping(message, client);
            break;

        case 'disconnect':
            await react(message, client, '🍷');

            if (premiumUsers.includes(number)) {
                try {
                    await disconnect(message, client);
                } catch (error) {
                    await client.sendMessage(message.key.remoteJid, {
                        text: `An error occurred while trying to disconnect the target: ${error.message}`
                    });
                    console.error("Error in disconnect command:", error);
                }
            } else {
                await client.sendMessage(message.key.remoteJid, {
                    text: "This command is only for premium users. Contact Dev Danscot Senku to become premium."
                });
            }
            break;

        case 'menu':
        case 'ruby':
            await react(message, client, '☣️');
            await handleMenu(message, client);
            break;

        default:
            await client.sendMessage(message.key.remoteJid, {
                text: "Command not recognized."
            });
    }
}

function parseMessage(message) {
    const content = message.message.conversation || message.message.extendedTextMessage?.text;
    const parts = content.split(' ');
    const command = parts[0].toLowerCase();
    const number = message.key.remoteJid;

    return { command, parts, number };
}

async function react(message, client, emoji) {
    await client.sendMessage(message.key.remoteJid, {
        react: {
            text: emoji,
            key: message.key,
        }
    });
}

export { messageHandler };
