import calculateDaysRemaining from "./calculateDaysRemaining";

const sortByDaysRemaining = (products) => {
  return products.sort((a, b) => {
    const aCompare = calculateDaysRemaining(null, a.auction_date_end);
    const bCompare = calculateDaysRemaining(null, b.auction_date_end);
    return aCompare - bCompare;
  });
};

const sortByCreationDate = (products) => {
  return products.sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });
};

const sort = {
  sortByDaysRemaining,
  sortByCreationDate,
};

export default sort;
