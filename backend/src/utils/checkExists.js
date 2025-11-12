// Utility function to check if exists in the database
const checkExists = async (Model, field, value) => {
  const query = {};
  query[field] = value;
  
  const existing = await Model.findOne(query);

  return !!existing;
};

module.exports = { 
  checkExists 
};