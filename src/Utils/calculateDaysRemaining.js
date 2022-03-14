const calculateSQLDaysRemaining = (dateEnd) => {
  const jsDate = dateEnd.split("-");
  const endDate = new Date(jsDate[0], jsDate[1], jsDate[2]);

  let dayOfMonth = new Date().getDate();
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();

  const nowDate = new Date(year, month, dayOfMonth);
  const nowDateTime = nowDate.getTime();
  const endDateTime = endDate.getTime();
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const difference = Math.abs(endDateTime - nowDateTime);
  return Math.round(difference / ONE_DAY);
};

export default calculateSQLDaysRemaining;
