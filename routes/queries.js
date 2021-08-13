// const dbName = 'sdctest';
// const dbName = 'sdc';

// const { Pool, Client } = require('pg');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  // host: 'host.docker.internal',   // doesn't work. got from stackoverflow
  // host: 'questions-api_web',   // doesn't work with image name.
  // host: 'questions-api_db_1',   // working with container name.
  host: 'db',    // working with compose.yml DB name.
  // host: 'localhost', // not working for docker. workes for local but not necessory
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});


// Check DB and Relations //

const getProductTb = async(req, res) => {
  // res.send('u c me?')
  try {
    const results = await pool.query('select * from product where id<10');
    // const results = await pool.query('select * from product where id=1');
    // const results = await pool.query('select * from product where id=188');
    res.status(200).send(results.rows);

  } catch (err) {
    res.status(500).send({message: err.message});
  }
};

const getQuestionsTb = async(req, res) => {
  try {
    const results = await pool.query('select * from questions where product_id=188 order by id ASC');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};

const getAnswersTb = async(req, res) => {
  try {
    const results = await pool.query('select * from answers where question_id=607 order by id ASC');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};

const getAnswers_photosTb = async(req, res) => {
  try {
    const results = await pool.query('select * from answers_photos where answer_id=1202');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};

const getCheckTb = async(req, res) => {
  try {
    ///////// array_agg  FOR TESTING TOO/////////////
    const results = await pool.query("SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, COALESCE(json_agg(JSONB_BUILD_OBJECT('id', aap.answer_id, 'body', aap.body, 'date', aap.date, 'answerer_name', aap.answerer_name, 'helpfulness', aap.helpfulness, 'photos', aap.photos) order by aap.answer_id) filter (where aap.answer_id is not null) , '[]') as answers FROM questions q LEFT JOIN LATERAL (SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM answers a LEFT JOIN answers_photos ap on ap.answer_id=a.id WHERE a.question_id=q.id and reported=false group by a.id order by a.id) aap ON q.id=aap.question_id WHERE product_id=188 and q.reported=false GROUP by q.id;");

    // const results = await pool.query("SELECT a.id as answer_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(json_agg(JSON_BUILD_OBJECT('id', ap.id, 'url', ap.url) order by ap.id) filter (where ap.id is not null) , '[]') as photos FROM answers a LEFT JOIN answers_photos ap on ap.answer_id=a.id WHERE question_id=606 and reported=false group by a.id order by a.id;");

    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};


// REAL WORK using promises//

// app.get('/products', db.getProducts);
const getProducts = async(req, res) => {
  try {
    const results = await pool.query('select * from product where id<10');
    // const results = await pool.query('select * from product where id=1');
    // const results = await pool.query('select * from product where id=188');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
    // throw err;
  }
};


let convertAnswerFormat = (row, idKey, photo) => {
  return {
    [idKey]: row[idKey],
    "body": row.body,
    "date": row.date,
    "answerer_name": row.answerer_name,
    "helpfulness": row.helpfulness,
    "photos": photo
  }
};


// // postgres array+json agg for questions.
const getQuestions = async(req, res) => {

  let page, count, offset;

  try {
    if (!req.query.page) {
      page = 1;
    } else {
      page = Number(req.query.page);
    }
    if (!req.query.count) {
      count = 4;
    } else {
      count = Number(req.query.count);
    }
    offset = count * (page - 1);

    // // using slice. always same speed.
    let queryQ = "SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, COALESCE(json_agg(JSONB_BUILD_OBJECT('id', aap.answer_id, 'body', aap.body, 'date', aap.date, 'answerer_name', aap.answerer_name, 'helpfulness', aap.helpfulness, 'photos', aap.photos) order by aap.answer_id) filter (where aap.answer_id is not null) , '[]') as answers FROM questions q LEFT JOIN LATERAL (SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM answers a LEFT JOIN answers_photos ap on ap.answer_id=a.id WHERE a.question_id=q.id and reported=false group by a.id order by a.id) aap ON q.id=aap.question_id WHERE product_id=$1 and q.reported=false GROUP by q.id;";
    let valueQ = [req.query.product_id];

    let questions = await pool.query(queryQ, valueQ);
    let allQuestions = questions.rows;

    allQuestions.forEach( question => {
      let currAnswers = question.answers;
      question.answers = {};
      currAnswers.forEach( answer => {
        question.answers[answer.id] = answer;
      } )
    } )
    let allQuestionResults = allQuestions.slice(offset, offset + count);

    let results = {
      product_id: req.query.product_id.toString(),
      results: allQuestionResults
      // results: allQuestions
    };
    res.status(200).send(results);
    // res.status(200).send(allQuestions);
  } catch (err) {
    res.status(500).send({message: err.message});
    // throw err;
  }
};


// # '/qa/questions': addQuestion.jsx
// app.post('/qa/questions?product_id=28212', db.addQuestion);
const addQuestion = async(req, res) => {
  try {
    // console.log('req.body', req.body);
    const { product_id, body, name, email } = req.body;
    const query = 'INSERT INTO questions (product_id, body, asker_name, asker_email) VALUES ($1, $2, $3, $4) RETURNING id';
    const value = [product_id, body, name, email];

    let newQuestion = await pool.query(query, value);
    // res.status(201).send(`New question added for product_id: ${product_id}`);
    res.status(201).send(`New question added with ID: ${newQuestion.rows[0].id} `);
  } catch (err) {
    res.status(500).send({message: err.message});
    // throw err;
  }
};


// `/qa/questions/${this.props.question.question_id}/helpful`: questionsEntry.jsx
// app.put('qa/questions/213336/helpful', db.likeQuestion);
const likeQuestion = async(req, res) => {
  try {
    // console.log('req.params.question_id', req.params.question_id);
    pool.query('UPDATE questions SET helpful=helpful+1 WHERE id=$1', [req.params.question_id]);
    res.status(204).send(`Liked question_id: ${req.params.question_id}`);
  } catch (err) {
    res.status(500).send({message: err.message});
    // throw err;
  }
};


// # `/qa/questions/${this.props.question.question_id}/report`: questionsEntry.jsx
// app.put('qa/questions/232306/report', db.reportQuestion);
const reportQuestion = async(req, res) => {
  try {
    // console.log('req.params.question_id', req.params.question_id);
    pool.query('UPDATE questions SET reported=true WHERE id=$1', [req.params.question_id]);
    res.status(204).send(`Reported question_id: ${req.params.question_id}`);
  } catch (err) {
    res.status(500).send({message: err.message});
    // throw err;
  }
};


// `/qa/questions/${this.props.questionId}/answers`: answerlist.jsx
// app.get('/qa/questions/213336/answers', db.getAnswers);
const getAnswers = async(req, res) => {
  // console.log(req.query);
  let page, count, offset;

  try {
    if (!req.query.page) {
      page = 1;
    } else {
      page = Number(req.query.page);
    }
    if (!req.query.count) {
      count = 5;
    } else {
      count = Number(req.query.count);
    }
    offset = count * (page - 1);
    let question_id = req.params.question_id;

     // use json_agg
    let queryA = "SELECT a.id as answer_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(json_agg(JSON_BUILD_OBJECT('id', ap.id, 'url', ap.url) order by ap.id) filter (where ap.id is not null) , '[]') as photos FROM answers a LEFT JOIN answers_photos ap on ap.answer_id=a.id WHERE question_id=$1 and reported=false group by a.id order by a.id;";
    const answers = await pool.query(queryA, [question_id]);
    let answerResults = answers.rows.slice(offset, offset + count);

    // //  // use json_agg with offset and limit. slightly slower than using JS slick
    // let queryA = "WITH a AS (SELECT * from answers WHERE question_id=$1 and reported=false GROUP by id LIMIT $2 OFFSET $3) SELECT a.id as answer_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(json_agg(JSON_BUILD_OBJECT('id', ap.id, 'url', ap.url) order by ap.id) filter (where ap.id is not null) , '[]') as photos FROM a LEFT JOIN answers_photos ap on ap.answer_id=a.id group by a.id, a.body, a.date_written, a.answerer_name, a.helpful;";
    // const answers = await pool.query(queryA, [question_id, count, offset]);

    let results = {
      question: question_id.toString(),
      page: page,
      count: count,
      // results: answers.rows
      results: answerResults
    };
    res.status(200).send(results);
    //  // use json_agg end...

    // console.log(req.query.page, page, req.query.count, count, offset)

  } catch (err) {
    res.status(500).send({message: err.message});
  }
};



// # `/qa/questions/${this.props.questionId}/answers`: addAnswerModal.jsx
// # "https://api.cloudinary.com/v1_1/hrrpp28fec/image/upload"
// app.post('/qa/questions/213336/answers', db.addAnswer);
// {
//   "body": "Teeeeest answer to be posted",
//   "name": "Answer person",
//   "email": "answerer@gmail.com",
//   "photos": []
// }
const addAnswer = async(req, res) => {
  try {
    // console.log('req.body', req.body);
    const { body, name, email, photos } = req.body;
    const queryA = 'INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING id';
    const valueA = [req.params.question_id, body, name, email];
    const queryP = 'INSERT INTO answers_photos (answer_id, url) VALUES ($1, $2)';

    let newAnswer = await pool.query(queryA, valueA);
    photos.forEach(url => {
      const valueP = [newAnswer.rows[0].id, url];
      pool.query(queryP, valueP);
    })

    // res.status(201).send(`New answer added for answer_id: ${req.params.question_id}`);
    res.status(201).send(`New answer added with ID: ${newAnswer.rows[0].id}`);
  } catch (err) {
    // res.status(500).send({message: err.message});
    throw err;
  }
};

// # `/qa/answers/${this.props.answer.answer_id}/helpful`: answerEntry.jsx
// app.put('qa/answers/1992416/helpful', db.likeAnswer);
const likeAnswer = async(req, res) => {
  try {
    // console.log('req.params.answer_id', req.params.answer_id);
    pool.query('UPDATE answers SET helpful=helpful+1 WHERE id=$1', [req.params.answer_id]);
    res.status(204).send(`Liked answer_id: ${req.params.answer_id}`);
  } catch (err) {
    res.status(500).send({message: err.message});
    // throw err;
  }
};

// # `/qa/answers/${this.props.answer.answer_id}/report`: answerEntry.jsx
// app.put('qa/answers/1992415/report', db.reportAnswer);
const reportAnswer = async(req, res) => {
  try {
    // console.log('req.params.answer_id', req.params.answer_id);
    pool.query('UPDATE answers SET reported=true WHERE id=$1', [req.params.answer_id]);
    res.status(204).send(`Reported answer_id: ${req.params.answer_id}`);
  } catch (err) {
    res.status(500).send({message: err.message});
    // throw err;
  }
};

module.exports = {
  getProductTb,
  getQuestionsTb,
  getAnswersTb,
  getAnswers_photosTb,
  getCheckTb,
  getProducts,
  getQuestions,
  addQuestion,
  likeQuestion,
  reportQuestion,
  getAnswers,
  addAnswer,
  likeAnswer,
  reportAnswer
}

