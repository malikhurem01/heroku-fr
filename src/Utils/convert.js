const convertToJSDate = (date) => {
  const jsDate = date.split("-");
  return new Date(jsDate[0], jsDate[1], jsDate[2]);
};

const convert = {
  convertToJSDate,
};

export default convert;
