const mongoose = require('mongoose');
const Sequence = require('./app/models/sequence.model');  // Update the path accordingly

async function initializeSequence() {
    try {
        const userIdSequence = await Sequence.findOne({ name: 'userId' });
        if (!userIdSequence) {
            await Sequence.create({ name: 'userId', value: 10000 });
            console.log('Initialized userId sequence to 10000');
        }

        const sellTradeIdSequence = await Sequence.findOne({ name: 'sellTradeId' });
        if (!sellTradeIdSequence) {
            await Sequence.create({ name: 'sellTradeId', value: 20000 });
            console.log('Initialized sellTradeId sequence to 20000');
        }

        const contractFarmingIdSequence = await Sequence.findOne({ name: 'contractFarmingId' });
        if (!contractFarmingIdSequence) {
            await Sequence.create({ name: 'contractFarmingId', value: 30000 });
            console.log('Initialized contractFarmingId sequence to 30000');
        }

        const orderIdSequence = await Sequence.findOne({ name: 'orderId' });
        if (!orderIdSequence) {
            await Sequence.create({ name: 'orderId', value: 40000 });
            console.log('Initialized orderId sequence to 40000');
        }
    } catch (error) {
        console.error('Error initializing sequences:', error);
    }
}

module.exports = initializeSequence;
