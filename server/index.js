const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ))
const PORT = 3000;



// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// })

const db = require('../routes/queries');
// app.use('/sdc', sdcRouter);


app.get('/sdc/product', db.getProduct);
app.get('/sdc/questions', db.getQuestions);
app.get('/sdc/answers', db.getAnswers);
app.get('/sdc/answers_photos', db.getAnswers_photos);
app.get('/sdc/check', db.getCheck);


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});

module.exports = app;







