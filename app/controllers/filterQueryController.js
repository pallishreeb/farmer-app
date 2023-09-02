const Crops = require('../models/crop.model');


exports.getFilterQueryData = async (req,res)=>{
    const categoryname = req.body.name
    if(categoryname=="Fruits" || categoryname=="Vegetables" || categoryname=="Crops"){
    let findresult = await Crops.find({categoryname:categoryname});
    if (!findresult) return res.status(404).send({message:'No category found.'});
    res.status(200).send({ status: true, result:findresult });
    }else{
        if(categoryname=="") return res.send({Message:"Please Enter Some Value in Name..."});
        else{
        res.send({Message:"Please Enter Valid Name"})}
    }
}
 
exports.getFilterCommodity = async (req, res) => {
    const name = req.body.name;
    try {
      let result = await Crops.find({
        "names.name": name
      });
  
      if (!result || result.length === 0) {
        return res.status(404).send({ status: false, message: 'No name found.' });
      } else {
        return res.status(200).send({ status: true, result: result });
      }
    } catch (err) {
      return res.status(500).send({ status: false, message: 'Error while fetching data.' });
    }
  };
