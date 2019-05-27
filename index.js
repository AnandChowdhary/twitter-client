const Sentiment = require("sentiment");

const sentiment = new Sentiment();

const getSentiment = text => {
  const number = sentiment.analyze(text);
  return (number.score / (number.tokens.length * 5));
};
