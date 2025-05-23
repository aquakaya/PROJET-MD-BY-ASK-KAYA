const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 3000,
    SESSION_ID: process.env.SESSION_ID,
    MODE: process.env.MODE || 'public',
    AUTO_REACT: process.env.AUTO_REACT === 'true',
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN === 'true',
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY === 'true',
    STATUS_READ_MSG: process.env.STATUS_READ_MSG || '✅ Auto Status Seen Bot By TONIC-MD',
    PREFIX: process.env.PREFIX || '!',
    AUTO_READ: process.env.AUTO_READ === 'true',
    AUTO_TYPING: process.env.AUTO_TYPING === 'true',
    AUTO_RECORDING: process.env.AUTO_RECORDING === 'true',
    ANTI_SPAM: process.env.ANTI_SPAM === 'true'
};
