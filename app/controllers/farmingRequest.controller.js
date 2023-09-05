const FarmingRequest= require("../models/farmingRequest.model");
const User = require("../models/user.model");
const ContractFarming = require("../models/contractFarming.model");
const mongoose = require("mongoose")

//Send ccontract farming request to farmers
exports.farmingRequest = async (req, res) => {
  try {
    const {
      location,
      quality,
      quantity,
      farmersToRequest,
      category,
      commodity,
      deliveryTime,
    } = req.body;

    let buyerId = req.user.id;
    // console.log(buyerId,"buyerId");
    let user = await User.findById({ _id: mongoose.Types.ObjectId(buyerId) });

    if (!user)
      return res
        .status(400)
        .send({ Message: "Can't Find Buyer Data With Given Id" });

    if (user && user.userType !== "buyer") {
      return res
        .status(400)
        .send({
          Message: `This is user is a ${user?.userType}, and ${user?.userType} can't perform this action`,
        });
    }
    const data = {
      location,
      quality,
      quantity,
      farmersToRequest,
      category,
      commodity,
      deliveryTime,
      buyerId,
    };
    let contractFarming = new FarmingRequest(data);
    contractFarming
      .save()
      .then((result) => {
        // console.log("response", result);
        return res
          .status(200)
          .json({ Message: "Sent contract farming request successfully!", result });
      })
      .catch((err) => {
        console.log("Error in adding contract farming request", err);
        return res.status(500).json({
          message:
            err.message ||
            "Some error occurred while sending contract farming request.",
        });
      });
  } catch (error) {
    console.log("Error in contract farming controller", error);
    return res.status(500).json({
      Message: "Internal server error,Try later!",
    });
  }
};

//get all the farmers list buyer want to send request based on type and crops
exports.contractFarmerList = async (req, res) => {
  try {
    const commodityName = req.query.commodityName;

    // Find all farmers with the given commodity name and contract-farming
   
    const contractFarmers = await ContractFarming.find({});

    // Extract distinct farmer IDs
    const farmerIds = [...new Set(contractFarmers.map(item => item.farmer_id.toString()))];

    const farmers = await User.find({ 
      _id: { $in: farmerIds },
      userType: 'farmer', 
      crops: { $elemMatch: { name: commodityName } },
    });

    if(farmers.length == 0){
      return res.send({Message: 'No Contract farmers found for this Commodity'})
    }
    return res.json({
      success:true,
      farmers
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  };
};

//get all contract farming requests for a farmer
exports.getAllFarmingRequest = async (req,res) =>{
  try {
    // Find all contractFarmings  request
    const contractFarmingRequests = await FarmingRequest.find({}).populate('buyerId','fullname userdetail');
    if(contractFarmingRequests .length == 0){
      return res.send({Message: 'No Contract farming found'})
    }
    return res.json({
      success:true,
      contractFarmingRequests 
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  };
}

//get all contract farming request made by a buyer for himself
exports.getMyFarmingRequest = async (req,res) =>{
  try {
    const buyerId = req.user.id;

    // Find all contractFarmings  request made by a buyer
    const contractFarmingRequests = await FarmingRequest
    .find({buyerId : mongoose.Types.ObjectId(buyerId)})
    .populate('farmersAccepted')
    .populate('farmersDelivered');


    if(contractFarmingRequests?.length == 0){
      return res.send({Message: 'No Contract farming found'})
    }
    return res.json({
      success:true,
      farmingRequsts:contractFarmingRequests,
      totalFarmingRequests: contractFarmingRequests ? contractFarmingRequests.length : 0,
      accepted: contractFarmingRequests?.farmersAccepted?.length || 0,
      delivered: contractFarmingRequests?.farmersDelivered?.length || 0,
    })
  } catch (error) {
    console.log("error in getMyContractFarming requests",error)
    res.status(500).json({ error: 'Internal server error' });
  };
}

//update the farmersAccpeted list when any farmer accepting the request
exports.updateAcceptedFarmers = async(req,res) =>{
  try {
    const farmingRequestId = req.query.farmingRequestId;
    const { farmerId } = req.body; //  send the farmers's ID in the request body

    // Check if the request with the given ID exists
    const farmingRequest = await FarmingRequest.findById({_id : mongoose.Types.ObjectId(farmingRequestId)});

    if (!farmingRequest) {
      return res.status(404).json({ error: 'Farming request not found' });
    }

    // Check if the user has already accepted the request
    if (farmingRequest.farmersAccepted.includes(farmerId)) {
      return res.status(400).json({ error: 'User has already accepted this request' });
    }

    // Add the user's ID to the farmersAccepted array
    farmingRequest.farmersAccepted.push(farmerId);

    // Save the updated request
    await farmingRequest.save();

   return res.json({ message: `Farming request accepted successfully by farmer with Id ${farmerId}` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
//update the deliver status when farmers delivered succesfully and add farmer to successDelivery list
exports.updateFarmersDelivered = async(req,res) =>{
  try {
    const farmingRequestId = req.query.farmingRequestId;
    const { farmerId } = req.body; //  send the farmers's ID in the request body

    // Check if the request with the given ID exists
    const farmingRequest = await FarmingRequest.findById({_id : mongoose.Types.ObjectId(farmingRequestId)});

    if (!farmingRequest) {
      return res.status(404).json({ error: 'Farming request not found' });
    }

    // Check if the user has already accepted the request
    if (farmingRequest.farmersDelivered.includes(farmerId)) {
      return res.status(400).json({ error: 'User has already accepted this request' });
    }

    // Add the user's ID to the farmersAccepted array
    farmingRequest.farmersDelivered.push(farmerId);
    // Save the updated request
    await farmingRequest.save();

   return res.json({ message: `Farmer with Id ${farmerId} delivered request commodity successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

//get a single farming request details 
exports.getFarmingRequestDetails = async(req,res) =>{
  try {
    const farmingRequestId = req.query.farmingRequestId;
    // Check if the request with the given ID exists
    const farmingRequest = await FarmingRequest.findById({_id : mongoose.Types.ObjectId(farmingRequestId)});

    if (!farmingRequest) {
      return res.status(404).json({ error: 'Farming request not found' });
    }

   return res.json({ 
    message: `Fetched details of farming request with Id ${farmingRequestId}`,
    farmingRequest
  
  });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

//delete a conract reuest farming by created buyer
exports.deleteFarmingRequest = async(req,res) => {
  try {
    const requestId = req.query.farmingRequestId;
    const userId = req.user.id; // Assuming you have user authentication in place

    // Find the farming request by its ID
    const farmingRequest = await FarmingRequest.findById({_id:requestId});

    if (!farmingRequest) {
      return res.status(404).json({ error: 'Farming request not found' });
    }

    // Check if the user making the request is the creator of the farming request
    if (farmingRequest.buyerId.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this Farming request' });
    }

    // Delete the farming request
    await farmingRequest.remove();

    res.json({ message: 'Farming request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}