const TwitterStream = require("twitter-stream-api");
const Sentiment = require("sentiment");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const sentiment = new Sentiment();
const getSentiment = text => {
  const number = sentiment.analyze(text);
  return (number.score / (number.tokens.length * 5));
};
const getSentimentRaw = text => {
  const number = sentiment.analyze(text);
  return number.score;
};

const keys = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
};
const Twitter = new TwitterStream(keys, false);
Twitter.stream("statuses/filter", {
  track: ["#UCL", "#TOTLIV", "#LIVTOT", "#ChampionsLeague", "#UCLfinal", "#UCLfinal2019", "#Spurs", "#Tottenham", "#THFC", "#COYS", "#Liverpool", "#LFC", "#YNWA", "@SpursOfficial", "@LFC"]
});
Twitter.on("data", obj => {
  obj = JSON.parse(obj.toString());
  const object = {
    id: obj.id_str,
    text: obj.text,
    source: obj.source,
    in_reply_to_screen_name: obj.in_reply_to_screen_name,
    name: obj.user && obj.user.name,
    screen_name: obj.user && obj.user.screen_name,
    location: obj.user && obj.user.location,
    followers_count: obj.user && obj.user.followers_count,
    favourites_count: obj.user && obj.user.favourites_count,
    friends_count: obj.user && obj.user.friends_count,
    time_zone: obj.user && obj.user.time_zone,
    statuses_count: obj.user && obj.user.statuses_count,
    profile_image_url: obj.user && obj.user.profile_image_url,
    profile_link_color: obj.user && obj.user.profile_link_color,
    default_profile_image: obj.user && obj.user.default_profile_image,
    geo: JSON.stringify(obj.geo),
    coordinates: JSON.stringify(obj.coordinates),
    place: JSON.stringify(obj.place),
    quote_count: obj.quote_count,
    reply_count: obj.reply_count,
    retweet_count: obj.retweet_count,
    favorite_count: obj.favorite_count,
    lang: obj.lang,
    date: new Date(obj.created_at)
  };
  obj.entities && obj.entities.hashtags.forEach(hashtag => {
    object[`hashtag_${hashtag.text}`] = true;
  });
  object.sentiment = getSentiment(obj.text);
  object.sentiment_raw = getSentimentRaw(obj.text);
  fs.appendFile("data.json", ",\n" + JSON.stringify(object), () => {});
});
