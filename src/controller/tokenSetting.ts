const { Tokens } = require("../db/model");
const { Swap } = require("../db/model");

const findOne = async (props: any) => {
  const { filter } = props;
  const result = await Tokens.findOne(filter);
  return result;
};

const create = async (tokenInfo: any) => {
  try {
    const newToken = new Tokens(tokenInfo);
    const newTokenSave = await newToken.save();

    return newTokenSave;
  } catch (error) {
    return null;
  }
};

const deleteOne = async (props: any) => {
  const { filter } = props;
  await Swap.deleteOne(filter);
  const result = await Tokens.deleteOne(filter);
  return result;
};

export default {
  findOne,
  create,
  deleteOne,
};
