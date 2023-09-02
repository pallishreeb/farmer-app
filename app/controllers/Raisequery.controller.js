const RaiseQuery = require("../models/Raisequery.model");

exports.AddRaiseQuery = async (req, res) => {
  let raisequery = await RaiseQuery.findOne({
    buyer_username: req.body.buyer_username,
  });
  if (raisequery && raisequery._id) {
    return res.status(400).send({
      message: "Raise Query already exit",
    });
  }

  const Query = new RaiseQuery({
    buyer_username: req.body.buyer_username,
    minimum_order_quantity: req.body.minimum_order_quantity,
    harvesting_time: req.body.harvesting_time,
    delivery_date_time: req.body.delivery_date_time,
    product_delivered_states: req.body.product_delivered_states,
    urgent_order_time: req.body.urgent_order_time,
    status: req.body.status,
  });

  Query.save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Raise Query.",
      });
    });
};

exports.GetRaiseQuery = async (req, res) => {
  const findres = await RaiseQuery.find({});
  if (findres.length === 0) {
    return res.status(404).send({ message: "No Raise Query found." });
  } else {
    res.send({ message: "Raise Query Finded.", data: findres });
  }
};

exports.GetByRaiseQuery = async (req, res) => {
  const id = req.params.id;
  const findres = await RaiseQuery.findOne({ _id: id });
  console.log(findres, "findres");
  if (findres.length === 0) {
    return res.status(404).send({ message: "No Raise Query found." });
  } else {
    res.send({ message: "Raise Query Finded.", data: findres });
  }
};

exports.UpdateRaiseQuery = async (req, res) => {
  const result = await RaiseQuery.findByIdAndUpdate(
    req.params.id,
    {
      buyer_username: req.body.buyer_username,
      minimum_order_quantity: req.body.minimum_order_quantity,
      harvesting_time: req.body.harvesting_time,
      delivery_date_time: req.body.delivery_date_time,
      product_delivered_states: req.body.product_delivered_states,
      urgent_order_time: req.body.urgent_order_time,
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  if (!result)
    return res
      .status(500)
      .send({ Message: "Can't Find Raise Query Data with Given ID" });
  res
    .status(200)
    .send({ Message: "Your Data Successfully Updated", data: result });
};

exports.DeleteRaiseQuery = async (req, res) => {
  try {
    const result = await RaiseQuery.findByIdAndDelete(req.params.id);
    if (!result)
      return res
        .status(500)
        .send({ Message: "Can't Raise Query Please Check Your Data" });
    res
      .status(200)
      .send({ Message: "Raise Query Delete Successfully Done..." });
  } catch (err) {
    console.log(err);
  }
};
