import convert from "./convert";

const calculateDaysRemaining = (date = null, dateEnd) => {
  let nowDate;
  if (!date) {
    let dayOfMonth, month, year;

    dayOfMonth = new Date().getDate();
    month = new Date().getMonth() + 1;
    year = new Date().getFullYear();

    nowDate = new Date(year, month, dayOfMonth);
  } else {
    nowDate = convert.convertToJSDate(date);
  }
  const endDate = convert.convertToJSDate(dateEnd);

  const nowDateTime = nowDate.getTime();
  const endDateTime = endDate.getTime();

  const ONE_DAY = 1000 * 60 * 60 * 24;

  const difference = Math.abs(endDateTime - nowDateTime);

  return Math.round(difference / ONE_DAY);
};

export default calculateDaysRemaining;
