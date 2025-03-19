const documentExists = async (model, id) => {
  try {
    const document = await model.findById(id);
    if (!document) return false;
    return document;
  } catch (error) {
    if (error.name === "CastError") return false;
    console.error(error);
    throw error;
  }
};

export default documentExists;