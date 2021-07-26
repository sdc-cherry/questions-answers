const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ))
const PORT = 3030;

const dotenv = require('dotenv');
dotenv.config();

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
//   pool.end();
// })

const db = require('../routes/queries');
// app.use('/sdc', sdcRouter);

// TEST DB
app.get('/sdc/product', db.getProductTb);
app.get('/sdc/questions', db.getQuestionsTb);
app.get('/sdc/answers', db.getAnswersTb);
app.get('/sdc/answers_photos', db.getAnswers_photosTb);
app.get('/sdc/check', db.getCheckTb);


app.get('/products', db.getProducts);
// # '/qa/questions': questions.jsx. 'qa/questions?product_id=22122&page=1&count=5'
app.get('/qa/questions', db.getQuestions);
// # '/qa/questions': addQuestion.jsx
app.post('/qa/questions', db.addQuestion);
// {
//   "product_id": 28212,
//   "body": "Is it from France?",
//   "name": "Asker",
//   "email": "asker@gmail.com"
// }

// `/qa/questions/${this.props.question.question_id}/helpful`: questionsEntry.jsx
app.put('/qa/questions/:question_id/helpful', db.likeQuestion);
// # `/qa/questions/${this.props.question.question_id}/report`: questionsEntry.jsx
app.put('/qa/questions/:question_id/report', db.reportQuestion);


// `/qa/questions/${this.props.questionId}/answers`: answerlist.jsx
app.get('/qa/questions/:question_id/answers', db.getAnswers);
// # `/qa/questions/${this.props.questionId}/answers`: addAnswerModal.jsx
// # "https://api.cloudinary.com/v1_1/hrrpp28fec/image/upload"
app.post('/qa/questions/:question_id/answers', db.addAnswer);
// {
//   "body": "Teeeeest answer to be posted",
//   "name": "Answer person",
//   "email": "answerer@gmail.com",
//   "photos": []
// }

// # `/qa/answers/${this.props.answer.answer_id}/helpful`: answerEntry.jsx
app.put('/qa/answers/:answer_id/helpful', db.likeAnswer);
// # `/qa/answers/${this.props.answer.answer_id}/report`: answerEntry.jsx
app.put('/qa/answers/:answer_id/report', db.reportAnswer);


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});

module.exports = app;







