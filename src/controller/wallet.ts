const { Wallet } = require("../db/model");

const findOne = async (props: any) => {
  const { filter } = props;
  const result = await Wallet.findOne(filter);
  return result;
};

const create = async (
  userId: string,
  publicKey: string,
  privateKey: string | any
) => {
  try {
    const newWallet = new Wallet({
      userId,
      publicKey,
      privateKey,
    });

    const savedWallet = await newWallet.save();
    return savedWallet;
  } catch (error) {
    throw new Error("Database Error");
  }
};
const deleteOne = async (props: any) => {
  const { filter } = props;
  const result = await Wallet.deleteOne(filter);
  return result;
};

const find = async () => {
  const result = await Wallet.find();
  return result;
};
export default {
  findOne,
  create,
  deleteOne,
  find,
};
