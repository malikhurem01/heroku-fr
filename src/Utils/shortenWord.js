const shortenWord = (str, max) => {
  if (str.length <= max) return str;
  return str.substr(0, str.lastIndexOf(" ", max));
};

export default shortenWord;
