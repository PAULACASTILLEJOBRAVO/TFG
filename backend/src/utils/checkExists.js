// Utility function to check if exists in the database
const checkExists = async (Model, field, value) => {
  // If value is missing, no need to query DB
  if (value === undefined || value === null) return false;

  const query = {};
  query[field] = value;
  
  const existing = await Model.findOne(query);

  return !!existing;
};

module.exports = { 
  checkExists 
};