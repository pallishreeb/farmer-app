const Order = require('../models/orders.model');

// Create an Order
exports.createOrder = async (req, res) => {
  try {
    const {
      deliveryLocation,
      category,
      commodity,
      quality,
      quantity,
      deliveryTime,
      tradeId,
      farmer_id,
      basePrice
    } = req.body;

    // Validate required fields
    if (!deliveryLocation || !category || !commodity || !quality || !quantity || !deliveryTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new order
    const newOrder = new Order({
      deliveryLocation,
      category,
      commodity,
      quality,
      quantity,
      deliveryTime,
      tradeId, 
      farmer_id,
      basePrice,
      buyerId: req.user.id, // Set buyerId from authenticated user
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Orders for a Buyer
exports.getOrdersForBuyer = async (req, res) => {
  try {
    const buyerId = req.params.buyerId;

    // Find orders for the specific buyer
    const orders = await Order.find({ buyerId }).populate('farmer_id').populate('tradeId').sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Orders for a Farmer
exports.getOrdersForfarmer  = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;

    // Find orders for the specific farmer
    const orders = await Order.find({ farmer_id: farmerId }).populate('buyerId').populate('tradeId').sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Orders for a Farmer
exports.getOrdersForAdmin  = async (req, res) => {
  try {
    // Find orders for the specific farmer
    const orders = await Order.find({}).populate('buyerId').populate('farmer_id').populate('tradeId').sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Single Order Details
exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find the order by ID
    const order = await Order.findById(orderId).populate('farmer_id').populate('buyerId').populate('tradeId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Order Details and Status
exports.editAnOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const updateFields = req.body; // Fields to be updated
    
        // Find the order by ID
        const order = await Order.findById(orderId);
    
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
    
        // Update individual fields if they exist in the request
        if (updateFields.deliveryLocation) {
          order.deliveryLocation = updateFields.deliveryLocation;
        }
    
        if (updateFields.category) {
          order.category = updateFields.category;
        }
    
        if (updateFields.commodity) {
          order.commodity = updateFields.commodity;
        }
    
        if (updateFields.status) {
            order.status = updateFields.status;
          }

          if(updateFields.deliveryTime) {
            order.deliveryTime = updateFields.deliveryTime;
          }
      if(updateFields.quantity){
        order.quantity = updateFields.quantity
      }

      if(updateFields.quality){
        order.quality = updateFields.quality
      }
    
        // Save the updated order
        const updatedOrder = await order.save();
    
        res.status(200).json(updatedOrder);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an Order
exports.deleteAnOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Find and remove the order by ID
    const deletedOrder = await Order.findByIdAndRemove(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(204).end(); // No content response for successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


