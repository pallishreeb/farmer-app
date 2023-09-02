// const Addfarming = require("../models/addfarming.model");
// exports.AddFarming = async (req, res) => {
//     const data = {
//         farming_type: req.body.farming_type,
//         soil_type: req.body.soil_type,
//         farming_type: req.body.farming_type,
//         type_of_regular_farming: req.body.type_of_regular_farming,
//     }
//     Addfarming.create(data, (err, result) => {
//         console.log(result, "result")
//         if (err) {
//             res.status(500).send({ Error: "Data not inserted", err });
//         }
//         else {
//             res.status("200").send({ Message: "Data Insert successfully done...", data: result });
//         }
//     })
// }

// exports.getFarming = async (req, res) => {
//     const result = await Addfarming.find({});
//     if (!result) return res.status(500).send({ Message: "Insert Valid Id" });
//     res.status(200).send({ Message: " Find Successfully Done..", data: result })
// }


// exports.getFarmingByID = async (req, res) => {
//     const result = await Addfarming.findById(req.params.id);
//     if (!result) return res.status(500).send({ Message: "Insert Valid Id" });
//     res.status(200).send({ Message: " Find Successfully Done..", data: result })
// }

// exports.updateFarming = async (req, res) => {
//     const result = await Addfarming.findByIdAndUpdate(req.params.id, {
//         farmingtype: req.body.farmingtype,
//         soiltype: req.body.soiltype,
//         typeofregularfarming: req.body.typeofregularfarming,
//         cropquautity: req.body.cropquautity,

//     }, {
//         new: true
//     })
//     if (!result) return res.status(500).send({ Message: "Ple Enter Valid ID" })
//     res.send({ Message: "Your Data Successfully Updated", data: result })
// }

// exports.deleteFarming = async (req, res) => {
//     const result = await Addfarming.findByIdAndDelete(req.params.id);
//     if (!result) return res.status(500).send({ Message: "Insert Valid ID" });
//     res.status(200).send({ Message: "Data Delete Successfully Done.." })
// }
