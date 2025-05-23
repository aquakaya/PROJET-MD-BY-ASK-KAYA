import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import pino from 'pino';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { File } from 'megajs';
import config from './config.cjs';
import { messageHandler } from './handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const app = express();
const PORT = config.PORT;
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Session management
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function downloadSessionData() {
    try {
        console.log("Debugging SESSION_ID:", config.SESSION_ID);

        if (!config.SESSION_ID) {
            throw new Error('❌ Please add your session to SESSION_ID env !!');
        }

        const sessdata = config.SESSION_ID.split("ASK-MD~")[1];

        if (!sessdata || !sessdata.includes("#")) {
            throw new Error('❌ Invalid SESSION_ID format! It must contain both file ID and decryption key.');
        }

        const [fileID, decryptKey] = sessdata.split("#");

        console.log("🔄 Downloading Session...");
        const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        await fs.promises.writeFile(credsPath, data);
        console.log("🔒 Session Successfully Loaded !!");
        return true;
    } catch (error) {
        console.error('❌ Failed to download session data:', error);
        return false;
    }
}

async function init() {
    try {
        if (fs.existsSync(credsPath)) {
            console.log("🔒 Session file found, proceeding without QR code.");
        } else {
            const sessionDownloaded = await downloadSessionData();
            if (sessionDownloaded) {
                console.log("🔒 Session downloaded, starting bot.");
            } else {
                console.log("No session found or downloaded, QR code will be printed for authentication.");
            }
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

init();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
