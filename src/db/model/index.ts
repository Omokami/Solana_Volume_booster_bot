import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TokenSettingSchema = new Schema({
  userId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  pairInfo: { type: Array, required: true },
  decimal: { type: Number, required: true },
  publicKey: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

export const Tokens = mongoose.model("tokens", TokenSettingSchema);

export const getMaxFromCollection = async (
  collection: mongoose.Model<any>,
  field = "_id"
) => {
  const v = await collection.countDocuments({});
  return (v as number) || 0;
};
