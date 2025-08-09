import Type from "../models/type.model";

export const findTypeById = async (id) => {
  try {
    const type = await Type.findById(id);
    if (!type) {
      const error = new Error("Type not found");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
