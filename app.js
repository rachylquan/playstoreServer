const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common')); // let's see what 'common' format looks like

const playstoreList = require('./playstore-data.js');

app.get('/playstore', (req, res) => {
  const { sort, genres = "" } = req.query;

  if (sort) {
    if (!['App', 'Rating'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of app or rating');
    }
  }

  let results = genres 
    ? playstoreList.filter(app => 
        app
          .Genres
          .includes(genres))
    : playstoreList;

  if (sort) {
    results
      .sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res
    .json(results);
});

module.exports = app;