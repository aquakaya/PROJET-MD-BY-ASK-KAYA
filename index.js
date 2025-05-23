import connectToWhatsApp from './events/index.js';

(async () => {

    await connectToWhatsApp(handleIncomingMessage);

})();