var authmiddleware = require('../middleware/authentication.middleware.js');11
const adminrequestschemas = require('../requestschema/adminrequestschema.js');
const validaterequestmiddleware = require('../middleware/validaterequest.middleware.js');
const TokenObj = require('../middleware/middleware')
const multer = require("multer")
const path = require('path');



var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'app/upload/post_sellTrade');
  },
  filename: function (req, file, callback) {
    console.log("File:", file)
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
var upload = multer({
  storage: Storage,
})

var profileStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'app/upload');
  },
  filename: function (req, file, callback) {
    console.log("File:", file)
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    console.log(file,'file')
  },
});

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /png|jpg|jpeg/; // Define the allowed file types
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true); // Accept the file
    }

    cb(new Error('Only PNG files are allowed')); // Reject the file
  },
});

var AdharStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'app/upload/adharcard');
  },
  filename: function (req, file, callback) {
    console.log("File:", file)
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    console.log(file,'file')
  },
});
var adharUpload = multer({
  storage:  AdharStorage,
})

var panStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'app/upload/pancard');
  },
  filename: function (req, file, callback) {
    console.log("File:", file)
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    console.log(file,'file')
  },
});
var panUpload = multer({
  storage: panStorage,
})

module.exports = (app) => {
  const admin = require('../controllers/admin.controller.js');
  const adminLogin = require('../controllers/adminlogin.controller.js');
  const farmer = require("../controllers/farmer.controller");
  const dealer = require("../controllers/dealer.controller");
  const buyer = require("../controllers/buyer.controller");
  const retailer = require("../controllers/retailer.controller")
  const selltrade = require("../controllers/sellTradeController");
  const filterQuery = require("../controllers/filterQueryController");
  const bank = require("../controllers/bank.controller");
  const addfarm = require("../controllers/addfarm.controller");
  const farmingType = require("../controllers/farmingType.controller");
  const verification = require("../controllers/verification.controller")
  const AddFarming = require('../controllers/addfarming.controller')  
  const temperature = require('../controllers/temperature.controller')
  const crops = require('../controllers/crops.controller.js')
  const Raisequery = require('../controllers/Raisequery.controller.js')
  const chat = require('../controllers/chat.controller.js')
  const FarmingRequest = require('../controllers/farmingRequest.controller.js');
  const messageController = require('../controllers/query.controller.js');
  
  // farmer
  app.post('/api/admin/register',profileUpload.single('profilePicture'),adminLogin.registerAdmin);
  app.post('/api/admin/login',adminLogin.Adminlogin);
  app.put('/api/admin/sendotp',adminLogin.sendotp);
  app.put('/api/admin/update/:id',profileUpload.single('profilePicture'),adminLogin.updateAdmin);
  app.put('/api/farmer/sendotp',farmer.sendotp);
  app.get('/api/admin/:id',adminLogin.getAdmin);
  app.get('/api/admin/profile/:id',adminLogin.getAdminImage);
  // app.put('/api/admin/update/:id',admin.updateAdmin);

  app.post('/api/farmer/farmerlogin',farmer.farmerlogin);
  app.delete('/api/admin/delete/:id',admin.deleteAdmin);
  // 'farmer','dealer','buyer','retailer'
  app.get('/api/admin/getadmin/:id',TokenObj.verifyUserType("farmer"),farmer.getAdminByID);
  app.post('/api/farmer/registerFarmer',profileUpload.single('profilePicture'),farmer.registerFarmer);
  app.get('/api/farmer/getfarmers', [TokenObj.verifyToken], farmer.getfarmers);
  app.get('/api/farmer/getfarmerprofile/:id', [TokenObj.verifyToken], farmer.getfarmerprofile);
  app.put('/api/farmer/updatefarmerbyid/:id',TokenObj.verifyUserType("farmer"),profileUpload.single('profilePicture'), farmer.updatefarmerbyid);
  app.delete('/api/farmer/logoutfarmer/:id', TokenObj.verifyUserType("farmer"), farmer.logoutfarmer);
  app.put('/api/farmer/update-type/:id',TokenObj.verifyUserType("farmer"), farmer.updateuserprofile);
  //reatailer
  app.post('/api/reatailer/registerRetailer', profileUpload.single('profilePicture'), retailer.registerRetailer);
  app.get('/api/reatailer/getretailer', [TokenObj.verifyToken], retailer.getretailer);
  app.get('/api/reatailer/getretailerprofile/:id', [TokenObj.verifyToken], retailer.getretailerprofile);
  app.put('/api/reatailer/updateretailerbyid/:id',TokenObj.verifyUserType("retailer"), profileUpload.single('profilePicture'), retailer.updateretailerbyid);
  app.delete('/api/reatailer/logoutretailer/:id', TokenObj.verifyUserType("retailer"), retailer.logoutretailer);
  // crop

  // user
  app.get('/api/admin/getusertype',[TokenObj.verifyToken], admin.getUsertypes);
  app.get('/api/admin/userdetailbyid/:userid', [TokenObj.verifyToken], admin.userdetail);
  // lands
  app.get('/api/admin/landmeasurementunits',[TokenObj.verifyToken], admin.landmeasurementunits);
  app.get('/api/admin/landtypes',[TokenObj.verifyToken], admin.landtypes);
  // citystate
  app.get('/api/admin/getcitystate', [TokenObj.verifyToken], admin.getcitystate);  
  // dealer
  app.post('/api/dealer/createdealer', validaterequestmiddleware(adminrequestschemas.createDealer), dealer.createdealer);
  app.get('/api/dealer/getdealers',  [TokenObj.verifyToken], dealer.getdealers);
  app.get('/api/dealer/getdealerprofile/:id',  [TokenObj.verifyToken], dealer.getdealerprofile);
  app.put('/api/dealer/updatedealerbyid/:id',TokenObj.verifyUserType("dealer"), dealer.updatedealerbyid);
  app.delete('/api/dealer/logoutdealer/:id',TokenObj.verifyUserType("dealer"), dealer.logoutdealer);
  // buyer 
  app.post('/api/buyer/register', buyer.registerBuyer);
  app.post('/api/buyer/login', buyer.Buyerlogin);
  app.put('/api/buyer/sendotp', buyer.Usersendotp);
  app.get('/api/buyer/getbuyer', buyer.getbuyer);
  app.get('/api/buyer/getbuyerprofile/:id',  [TokenObj.verifyToken], buyer.getbuyerprofile);
  app.put('/api/buyer/updatebuyerbyid/:id',TokenObj.verifyUserType("buyer"), buyer.updatebuyerbyid);
  app.delete('/api/buyer/logoutbuyer/:id', TokenObj.verifyUserType("buyer"), buyer.logoutbuyer);
  // sellTrade 
  app.post('/api/selltrade/selltrade',upload.array('image', 3),[TokenObj.verifyFarmer('farmer')], selltrade.sellTrade);
  app.get('/api/selltrade/getselltrade',  [TokenObj.verifyToken], selltrade.GetSellTrade);
  app.get('/api/selltrade/getmyselltrade',  [TokenObj.verifyFarmer('farmer')], selltrade.GetMySellTrade);
  app.get('/api/selltrade/imageSellTrade/:id', TokenObj.verifyUserType("farmer"), selltrade.GetbyimageSellTrade);
  app.get('/api/selltrade/Variety',TokenObj.verifyUserType("farmer"), selltrade.getVariety);
  app.get('/api/selltrade/getselltradebyid/:id', TokenObj.verifyUserType("farmer"), selltrade.GetBySellTrade);
  app.put('/api/selltrade/selltrade/update/:id', TokenObj.verifyUserType("farmer"), upload.single('image'), selltrade.updatesellTrade);
  app.delete('/api/selltrade/selltrade/delete/:id', TokenObj.verifyUserType("farmer"), selltrade.DeleteSellTrade);
  // filterQuery
  app.get('/api/filterQuery/getfilterQuery',  [TokenObj.verifyToken], filterQuery.getFilterQueryData);
  app.get('/api/filterQuery/getfiltercommodity',  [TokenObj.verifyToken], filterQuery.getFilterCommodity);
  // bank
  
  // Raise Query
  app.post('/api/raisequery/add',[TokenObj.verifyToken], Raisequery.AddRaiseQuery);
  app.get('/api/raisequery/get',[TokenObj.verifyToken], Raisequery.GetRaiseQuery);
  app.get('/api/raisequery/get/:id',[TokenObj.verifyToken], Raisequery.GetByRaiseQuery);
  app.put('/api/raisequery/update/:id',[TokenObj.verifyToken], Raisequery.UpdateRaiseQuery);
  app.delete('/api/raisequery/delete/:id',[TokenObj.verifyToken], Raisequery.DeleteRaiseQuery);


  app.post('/api/bank/loginbankaccount', [TokenObj.verifyToken], bank.loginbankaccount);
  app.get('/api/bank/getbankaccount',  [TokenObj.verifyToken], bank.getbankaccount);
  app.get('/api/bank/getbankaccountById/:id',  [TokenObj.verifyToken], bank.getbankaccountbyID);
  app.put('/api/bank/updatebankaccount/:id',  [TokenObj.verifyToken],bank.updatebankaccount)
  app.delete('/api/bank/deletebankaccount/:id',  [TokenObj.verifyToken], bank.deletebankaccount);
  // addfarm
  app.post('/api/farmer/addfarm',TokenObj.verifyUserType("farmer"),addfarm.addfarm);
  app.get('/api/farmer/getallfarm',TokenObj.verifyUserType("farmer"),addfarm.getallfarm)
  app.get('/api/farmer/getfarmerfarm',TokenObj.verifyUserType("farmer"),addfarm.getfarmerfarm);

  //RegulerFarming
  app.post('/api/chat/send',[TokenObj.verifyToken],chat.SendMessage);
  app.get('/api/chat/received',[TokenObj.verifyToken],chat.ReceivedMessage);
  app.get('/api/chat/sender/:senderId',[TokenObj.verifyToken],chat.MessagebysenderId);
  app.get('/api/chat/receiver/:receiverId',[TokenObj.verifyToken],chat.MessagebyreceiverId);


  app.post('/api/farmingtype/addregulerfarming', TokenObj.verifyUserType("farmer"), farmingType.addregulerfarming);
  app.get('/api/farmingtype/getregulerfarming',TokenObj.verifyUserType("farmer"),farmingType.getregulerfarming)
  app.post('/api/farmingtype/addcontractfarming', TokenObj.verifyUserType("farmer"),farmingType.addcontractfarming);
  app.get('/api/farmingtype/getcontractfarming', TokenObj.verifyUserType("farmer"),farmingType.getcontractfarming)
  app.post('/api/farmingtype/addorganicfarming', TokenObj.verifyUserType("farmer"),farmingType.addorganicfarming);
  app.get('/api/farmingtype/getorganicfarming',TokenObj.verifyUserType("farmer"),farmingType.getorganicfarming)
  //verification
  app.post('/api/verification/addadharcard', [TokenObj.verifyToken],adharUpload.fields([{name:"frontSidePhoto"},{name:"backSidePhoto"}]),verification.addadharcard)
  app.post('/api/verification/addpancard',  [TokenObj.verifyToken],panUpload.single("panCardPhoto"),verification.addpancard)

  // Add Farming
  // app.post('/api/farming/create',[TokenObj.verifyToken],AddFarming.AddFarming)
  // app.get('/api/farming/get',[TokenObj.verifyToken],AddFarming.getFarming)
  // app.get('/api/farming/getById/:id',[TokenObj.verifyToken],AddFarming.getFarmingByID)
  // app.put('/api/farming/update/:id',[TokenObj.verifyToken],AddFarming.updateFarming)
  // app.delete('/api/farming/delete',[TokenObj.verifyToken],AddFarming.deleteFarming)

  // temperature
  app.get('/api/temperature/get',[TokenObj.verifyToken],temperature.Findtemperature)


  //crops
  app.post('/api/crops/addCrop', [TokenObj.verifyType(["farmer","buyer"])],crops.addCrop);
  app.post('/api/crops/addCropcategory',[TokenObj.verifyType(["farmer","buyer"])], validaterequestmiddleware(adminrequestschemas.addCropcategory), crops.addcategory);
  app.get('/api/crops/getCropCategory',[TokenObj.verifyType(["farmer","buyer"])], crops.getcategory);       
  app.post('/api/crops/addCropSubcategory', [TokenObj.verifyType(["farmer","buyer"])],validaterequestmiddleware(adminrequestschemas.addCropSubcategory),crops.addSubcategory);
  app.get('/api/crops/getCropCategorybyname',[TokenObj.verifyType(["farmer","buyer"])], crops.getCropCategorybyname);
  app.post('/api/crops/addCropPrice',[TokenObj.verifyType(["farmer","buyer"])], validaterequestmiddleware(adminrequestschemas.addCropPrice),crops.addCropPrice);
  app.get('/api/crops/croplist',[TokenObj.verifyType(["farmer","buyer"])],crops.getCrop);
  app.get('/api/crops/getCropsByCategory',[TokenObj.verifyToken], crops.getCropsByCategory);  

  // app.get('/api/farmingtype/getregulerfarming',TokenObj.verifyUserType("farmer"),farmingType.getregulerfarming)
  // app.post('/api/farmingtype/addcontractfarming', TokenObj.verifyUserType("farmer"),farmingType.addcontractfarming);
  // app.get('/api/farmingtype/getcontractfarming', TokenObj.verifyUserType("farmer"),farmingType.getcontractfarming)
  // app.post('/api/farmingtype/addorganicfarming', TokenObj.verifyUserType("farmer"),farmingType.addorganicfarming);
  // app.get('/api/farmingtype/getorganicfarming',TokenObj.verifyUserType("farmer"),farmingType.getorganicfarming)

  //contract farming
  app.post("/api/contract/contractFarmRequest", [TokenObj.verifyBuyer("buyer")],FarmingRequest.farmingRequest);
  app.get("/api/contract/contractFarmers",[TokenObj.verifyBuyer('buyer') ],FarmingRequest.contractFarmerList);
  app.get("/api/contract/allFarmingRequests",[TokenObj.verifyToken], FarmingRequest.getAllFarmingRequest);
  app.get("/api/contract/myFarmingRequests",[TokenObj.verifyBuyer('buyer') ], FarmingRequest.getMyFarmingRequest);
  app.get("/api/contract/farmingRequest",[TokenObj.verifyToken], FarmingRequest.getFarmingRequestDetails );
  app.patch("/api/contract/acceptFarmingRequest", [TokenObj.verifyFarmer('farmer') ],FarmingRequest.updateAcceptedFarmers);
  app.patch("/api/contract/updateDelivered",[TokenObj.verifyBuyer('buyer')],FarmingRequest.updateFarmersDelivered);
  app.delete("/api/contract/deleteFarmingRequest",[TokenObj.verifyBuyer('buyer')], FarmingRequest.deleteFarmingRequest);


  //query messages routes

// Create a new message
app.post('/api/message',[TokenObj.verifyToken], messageController.postMessage);

// Get all messages between two users
app.get('/api/messages',[TokenObj.verifyToken], messageController.getMessagesBetweenUsers);

// Delete a message by ID
app.delete('/api/message',[TokenObj.verifyToken], messageController.deleteMessage);

}