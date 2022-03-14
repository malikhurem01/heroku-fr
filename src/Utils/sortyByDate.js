import { convertToJSDate, convertTimestampToJSDate } from "./convertToJSDate";

const sortByDate = (state, arr) => {
  if (state === "start")
    return arr.sort((a, b) => {
      let aDate = new Date(convertToJSDate(b.auction_date_start));
      let bDate = new Date(convertToJSDate(a.auction_date_start));
      return aDate - bDate;
    });
  else if (state === "end")
    return arr.sort((a, b) => {
      let aDate = new Date(convertToJSDate(b.auction_date_end));
      let bDate = new Date(convertToJSDate(a.auction_date_end));
      return aDate - bDate;
    });
};

export default sortByDate;
