const mongoose = require('mongoose');
const Sequence = require('./sequence.model');  // Update the path accordingly

const farmingRequestSchema = new mongoose.Schema(
  {
    contractFarmingId: { type: Number, unique: true },
    location: { type: String, require: true },
    category: { type: String, require: true },
    commodity: { type: String, require: true },
    quality: { type: String, require: true },
    quantity: { type: String, require: true },
    deliveryTime: { type: String, require: true },
    price: { type: String },
    basePrice: { type: String},
    isApproved: { type: Boolean, default: false },
    buyerId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin'
    },
    farmersToRequest: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
      }
    ],
    farmersAccepted: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
      }
    ],
    farmersDelivered: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
      }
    ],
    image: [],
    priceQuantityUnit: { type: String },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to assign contractFarmingId
farmingRequestSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const sequence = await Sequence.findOneAndUpdate(
        { name: 'contractFarmingId' },  // Using the contractFarmingId sequence
        { $inc: { value: 1 } },
        { new: true, upsert: true }  // upsert: create the document if it doesn't exist
      );

      this.contractFarmingId = sequence.value;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("farmingRequest", farmingRequestSchema);
