export const convertToJSDate = (date) => {
  const jsDate = date.split("-");
  return new Date(jsDate[0], jsDate[1], jsDate[2]);
};

export const convertTimestampToJSDate = (created) => {
  const timestamp = created.split("T");
  const jsDate = timestamp[0].split("-");
  return new Date(jsDate[0], jsDate[1], jsDate[2]);
};
