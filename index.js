const express = require('express');

const app = express();
app.use((req, res, next) => {
  res.set('Feature-Policy', "autoplay 'self'");
  next();
});
app.use(express.static('build'));

app.listen(8080);
