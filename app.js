const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(morgan("dev"));

const playstore = require("./playstore");

app.get("/apps", (req, res) => {
  const { sort, genres } = req.query;
  let filteredPlaystore = playstore
  if (sort || genres) {
    if (genres) {
      if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)){
        res.status(400).send('not included');
      }
      filteredPlaystore = playstore.filter(app => {
        return app.Genres.toLowerCase().includes(genres.toLowerCase());
      });

    }
    if (sort) {
      if (!["Rating", "App"].includes(sort)) {
        res.status(400).send("Can only sort by Rating or App");
      }
      if (["Rating"].includes(sort)) {
        playstore.sort((a, b) => {
          return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
        });
      } else {
        playstore.sort((a, b) => {
          return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
      }
    }
  }

  res.send(filteredPlaystore);
});
app.get('/', (req, res) => {
  res.status(200).send('Please navigate to /apps to see a list of apps. You can even search by genre and/or sort by Rating or App')
})

// app.listen(8000, () => {
//   console.log("Server is up and running on localhost:8000");
// });
module.exports = app;
