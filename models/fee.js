var mongoose = require("mongoose");
var Schema = mongoose.Schema;

feeSchema = new Schema({
  className: { type: String, trim: true },
  category: { type: String, trim: true, default: null },
  feesTitle: { type: String, trim: true },
  createdAt: { type: Number, default: Date.now },
  currency: { type: String, trim: true, default: "N" },
  subFees: [
    {
      _id: false,
      subName: { type: String, trim: true },
      subAmount: { type: Number, trim: true }
    }
  ],
  total: { type: Number, trim: true },
  session: { type: String, trim: true }
});

module.exports = mongoose.model("Fee", feeSchema);
