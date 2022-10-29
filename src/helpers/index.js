const isFieldEmpties = (fields) => {
  const filteredKeys = Object.keys(fields).filter(
    (key) => fields[key] == "" || fields[key] == undefined
  );

  return filteredKeys;
};

module.exports = {isFieldEmpties}