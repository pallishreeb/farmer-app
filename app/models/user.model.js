const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullName: {type:String, index:true},
    country: {type:String, index:true},
    taluka: {type:String, index:true},
    phone: {type:Number, unique: true},
    useridnumber:{type:String},
    locality:{type:String},
    city:{type:String},
    state:{type:String},
    pin:{type:String},
    userType: {
                  type: String,
                  enum : ['admin','farmer','dealer','buyer','retailer'],
                  default: 'farmer',
                  index:true
            },
    farmerdetail:{
        landsize:{type:Number},
        landmeasurmentunit:{type:String},
        landtype:{type:String}
    },
    userdetail:{
        gstNumber:{type:String},
        farmName:{type:String},
    },
    bankingdetail:{
       name:String,
       bankname:String,
       ifsccode:String,
       accountnumber:String,
       bankaddress:String 
    },
    otp:{
        type:String
    },
    crops:[{
        name: String,
        category: String,
        subcategoryname: String,
    }]
}, {
    timestamps: true
});

 module.exports = mongoose.model('Users', UserSchema);