// const dbName = 'sdctest';
const dbName = 'sdc';

// const { Pool, Client } = require('pg');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'Sharpless',
  host: 'localhost',
  database: dbName,
  password: process.env.DB_PASSWORD,
  port: 5432,
});


// Check DB and Relations //

const getProductTb = async(req, res) => {
  try {
    const results = await pool.query('select * from product where id=188');
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

    // array+json agg for questions. takse slightly longer time?
    // const results = await pool.query("SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, COALESCE(json_agg(JSONB_BUILD_OBJECT('id', aap.answer_id, 'body', aap.body, 'date', aap.date, 'answerer_name', aap.answerer_name, 'helpfulness', aap.helpfulness, 'photos', aap.photos) order by aap.answer_id) filter (where aap.answer_id is not null) , '[]') as answers FROM questions q LEFT JOIN LATERAL (SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM answers a LEFT JOIN answers_photos ap on ap.answer_id=a.id WHERE a.question_id=q.id and reported=false group by a.id order by a.id) aap ON q.id=aap.question_id WHERE product_id=188 and q.reported=false GROUP by q.id;");

    // const results = await pool.query("SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, COALESCE(json_agg(JSONB_BUILD_OBJECT('id', aap.answer_id, 'body', aap.body, 'date', aap.date, 'answerer_name', aap.answerer_name, 'helpfulness', aap.helpfulness, 'photos', aap.photos) order by aap.answer_id) filter (where aap.answer_id is not null) , '[]') as answers FROM questions q LEFT JOIN (SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM answers a LEFT JOIN answers_photos ap on ap.answer_id=a.id WHERE reported=false group by a.id order by a.id) aap ON q.id=aap.question_id WHERE product_id=188 and q.reported=false GROUP by q.id;");

    // json_agg -- doesn't allow nested agg
    // const results = await pool.query("SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, COALESCE(json_agg(JSON_BUILD_OBJECT('a_id', a.id, 'body', a.body, 'date', a.date_written, 'answerer_name', a.answerer_name, 'helpfulness', a.helpful, 'photos', COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}')) order by a.id) filter (where a.id is not null) , '[]') as answers FROM questions q LEFT JOIN answers a ON q.id=a.question_id and a.reported=false LEFT JOIN (select id, url, answer_id from answers_photos) ap on a.id=ap.answer_id WHERE product_id=188 and q.reported=false GROUP by q.id;");

    // const results = await pool.query("SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, COALESCE(json_agg(JSONB_BUILD_OBJECT('a_id', a.id, 'body', a.body, 'date', a.date_written, 'answerer_name', a.answerer_name, 'helpfulness', a.helpful, 'photosF', a.reported) order by a.id) filter (where a.id is not null) , '[]') as answers FROM questions q LEFT JOIN answers a ON q.id=a.question_id and a.reported=false WHERE product_id=188 and q.reported=false GROUP by q.id;");

    // array_agg with offset limit
    // const results = await pool.query("WITH q AS (select * from questions WHERE product_id=188 and reported=false order by id LIMIT 30 OFFSET 0) SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, question_id as a_question_id, a.id as id, a.body as body, a.date_written as date, answerer_name as answerer_name, a.helpful as helpfulness, a.reported as a_reported, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM q LEFT JOIN answers a ON q.id=question_id and a.reported=false LEFT JOIN (select id, url, answer_id from answers_photos) ap on a.id=answer_id GROUP by q.id, q.body, q.date_written, q.asker_name, q.helpful, q.reported, a.id;");

    ///////// array_agg  FOR TESTING TOO/////////////
    const results = await pool.query("SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, question_id as a_question_id, a.id as id, a.body as body, a.date_written as date, answerer_name as answerer_name, a.helpful as helpfulness, a.reported as a_reported, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM questions q LEFT JOIN answers a ON q.id=question_id and a.reported=false LEFT JOIN (select id, url, answer_id from answers_photos) ap on a.id=answer_id WHERE product_id=188 and q.reported=false GROUP by q.id, a.id;");

    // use group by
    // const results = await pool.query('SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, question_id as a_question_id, a.id as id, a.body as body, a.date_written as date, answerer_name as answerer_name, a.helpful as helpfulness, a.reported as a_reported, ap.id as ap_id, answer_id as ap_answer_id, url FROM questions q LEFT JOIN answers a ON q.id=question_id and a.reported=false LEFT JOIN answers_photos ap ON a.id=answer_id WHERE product_id=188 and q.reported=false GROUP by q.id, a.id, ap.id;');


    // const results = await pool.query("SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, question_id as a_question_id, a.id as id, a.body as body, a.date_written as date, answerer_name as answerer_name, a.helpful as helpfulness, a.reported as a_reported, COALESCE(array_agg(ap.url || ' ' || ap.id order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM questions q LEFT JOIN answers a ON q.id=question_id and a.reported=false LEFT JOIN (select id, url, answer_id from answers_photos) ap on a.id=answer_id WHERE product_id=188 and q.reported=false GROUP by q.id, a.id;");

    // use order by
    // const results = await pool.query('SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, question_id as a_question_id, a.id as id, a.body as body, a.date_written as date, answerer_name as answerer_name, a.helpful as helpfulness, a.reported as a_reported, ap.id as ap_id, answer_id as ap_answer_id, url FROM questions q LEFT JOIN answers a ON q.id=question_id and a.reported=false LEFT JOIN answers_photos ap ON a.id=answer_id WHERE product_id=188 and q.reported=false ORDER by q.id ASC, a.id ASC, ap.id ASC;');

    // use lateral to limit photos, takes double time (0.5s->1s) than left join...
    // const results = await pool.query('SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, ap.id as ap_id, ap.answer_id as ap_answer_id, url FROM answers a LEFT JOIN LATERAL (select * from answers_photos where answer_id=a.id limit 2) as ap ON a.id=ap.answer_id WHERE question_id=606 and reported=false order by a.id ASC, ap.id ASC;');

    // to_jsonb
    // const results = await pool.query("SELECT to_jsonb(rows) FROM (SELECT * FROM answers_photos where answer_id=1202) rows;");


    // const results = await pool.query("SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, array_agg(ap.url || ' ' || ap.id order by ap.id) as photoURLs FROM answers a LEFT JOIN (select * from answers_photos) ap on ap.answer_id=a.id WHERE question_id=606 and reported=false group by a.id order by a.id;");

    // const results = await pool.query('SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, ap.id as ap_id, ap.answer_id as ap_answer_id, url FROM answers a LEFT JOIN answers_photos ap ON ap.answer_id=a.id WHERE question_id=606 and reported=false order by a.id ASC, ap.id ASC;');

    // json_agg
    // const results = await pool.query("WITH a AS (SELECT * from answers WHERE question_id=606 and reported=false GROUP by id LIMIT 3 OFFSET 1) SELECT a.id as answer_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(json_agg(JSON_BUILD_OBJECT('id', ap.id, 'url', ap.url) order by ap.id) filter (where ap.id is not null) , '[]') as photos FROM a LEFT JOIN answers_photos ap on ap.answer_id=a.id group by a.id, a.body, a.date_written, a.answerer_name, a.helpful;");

    // const results = await pool.query('SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, ap.id as ap_id, ap.answer_id as ap_answer_id, url FROM answers a LEFT JOIN answers_photos ap ON ap.answer_id=a.id WHERE question_id=606 and reported=false group by a.id, ap.id;');

    // const results = await pool.query("SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, json_agg(JSON_BUILD_OBJECT('id', ap.id, 'answer_id', ap.answer_id, 'url', ap.url) order by ap.id) as photos FROM answers a LEFT JOIN answers_photos ap on ap.answer_id=a.id WHERE question_id=606 and reported=false group by a.id order by a.id;");

    // array_agg
    // const results = await pool.query("SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM answers a LEFT JOIN answers_photos ap on ap.answer_id=a.id WHERE question_id=606 and reported=false group by a.id order by a.id;");

    // const results = await pool.query('WITH a AS (SELECT * from answers where question_id=606 AND reported=false GROUP by id LIMIT 20 OFFSET 0) SELECT * from a;');


    // const results = await pool.query('WITH a AS (SELECT * from answers WHERE question_id=606 and reported=false GROUP by id LIMIT 30 OFFSET 0) SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, ap.id as ap_id, ap.answer_id as ap_answer_id, url FROM a LEFT JOIN answers_photos ap ON ap.answer_id=a.id WHERE question_id=606 and reported=false order by a.id ASC, ap.id ASC;');

    // const results = await pool.query('SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, ap.id as ap_id, ap.answer_id as ap_answer_id, url FROM answers a LEFT JOIN answers_photos ap ON ap.answer_id=a.id WHERE question_id=606 and reported=false order by a.id ASC, ap.id ASC;');

    // use left join
    //

    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};


// REAL WORK using promises//

// app.get('/products', db.getProducts);
const getProducts = async(req, res) => {
  try {
    const results = await pool.query('select * from product where id=188');
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

// // // postgres left join
// const getQuestions = async(req, res) => {

//   let page, count, offset;

//   try {
//     if (!req.query.page) {
//       page = 1;
//     } else {
//       page = Number(req.query.page);
//     }
//     if (!req.query.count) {
//       count = 4;
//     } else {
//       count = Number(req.query.count);
//     }
//     offset = count * (page - 1);

//     // // using slice. always same speed.
//     let queryQ = "SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, question_id as a_question_id, a.id as id, a.body as body, a.date_written as date, answerer_name as answerer_name, a.helpful as helpfulness, a.reported as a_reported, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM questions q LEFT JOIN answers a ON q.id=question_id and a.reported=false LEFT JOIN (select * from answers_photos) ap on a.id=answer_id WHERE product_id=$1 and q.reported=false GROUP by q.id, a.id;";
//     let valueQ = [req.query.product_id];


//     // // // using offset, limit. slightly slower when set a limit/offset on API
//     // let queryQ = "WITH q AS (select * from questions WHERE product_id=$1 and reported=false order by id LIMIT $2 OFFSET $3) SELECT q.id as question_id, q.body as question_body, q.date_written as question_date, asker_name, q.helpful as question_helpfulness, q.reported as reported, question_id as a_question_id, a.id as id, a.body as body, a.date_written as date, answerer_name as answerer_name, a.helpful as helpfulness, a.reported as a_reported, COALESCE(array_agg(ap.url order by ap.id) filter (where ap.id is not null) , '{}') as photos FROM q LEFT JOIN answers a ON q.id=question_id and a.reported=false LEFT JOIN (select * from answers_photos) ap on a.id=answer_id GROUP by q.id, q.body, q.date_written, q.asker_name, q.helpful, q.reported, a.id;";
//     // let valueQ = [req.query.product_id, count, offset];

//     let questions = await pool.query(queryQ, valueQ);
//     let allQuestions = [];
//     let currQuestion = {};
//     let currAnswer = {};
//     let prevQuestionId, currQuestionId, prevAnswerId, currAnswerId, currPhoto;

//     for (let i = 0; i < questions.rows.length; i++) {
//       currQuestionId = questions.rows[i].question_id;
//       currAnswerId = questions.rows[i].id;
//       if (currQuestionId === prevQuestionId) {
//         currPhoto = questions.rows[i].photos;
//         currAnswer[questions.rows[i].id] = convertAnswerFormat(questions.rows[i], 'id', currPhoto);
//       } else {
//         if (i !== 0) {
//           allQuestions.push(currQuestion);
//         }
//         currAnswer = {};
//         currPhoto = [];
//         if (!!questions.rows[i].id) {
//           currPhoto = questions.rows[i].photos;
//           currAnswer[questions.rows[i].id] = convertAnswerFormat(questions.rows[i], 'id', currPhoto);
//         }
//         currQuestion = {
//           "question_id": questions.rows[i].question_id,
//           "question_body": questions.rows[i].question_body,
//           "question_date": questions.rows[i].question_date,
//           "asker_name": questions.rows[i].asker_name,
//           "question_helpfulness": questions.rows[i].question_helpfulness,
//           "reported": questions.rows[i].reported,
//           "answers": currAnswer
//         }
//       }
//       prevQuestionId = currQuestionId;
//       prevAnswerId = currAnswerId;
//       if (i === questions.rows.length - 1) {
//         allQuestions.push(currQuestion);
//       }
//     }
//     let allQuestionResults = allQuestions.slice(offset, offset + count);
//     let results = {
//       product_id: req.query.product_id.toString(),
//       results: allQuestionResults
//       // results: allQuestions
//     };
//     res.status(200).send(results);
//   } catch (err) {
//     res.status(500).send({message: err.message});
//     // throw err;
//   }
// };


// // postgres array+json agg for questions. takse
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


// // postgres left join      // use left join query
// const getAnswersFn = async(queryA, question_id, forQestion, res, page, count, offset) => {
//   const answers = await pool.query(queryA, [question_id]);
//   // console.log('answers', answers)
//   let answerResults = [];
//   let prevAnswerId, currAnswer, currAnswerId, currPhoto;

//   for (let i = 0; i < answers.rows.length; i++) {

//     currAnswerId = answers.rows[i].answer_id;

//     if (currAnswerId === prevAnswerId) {
//       currAnswer.photos.push({
//         id: answers.rows[i].ap_id,
//         url: answers.rows[i].url
//       });
//     } else {
//       if (i !== 0) {
//         answerResults.push(currAnswer);
//       }
//       if (!answers.rows[i].ap_id) {
//         currPhoto = []
//       } else {
//         currPhoto = [{
//           id: answers.rows[i].ap_id,
//           url: answers.rows[i].url
//         }];
//       }
//       currAnswer = convertAnswerFormat(answers.rows[i], 'answer_id', currPhoto);
//     }
//     prevAnswerId = currAnswerId;
//     if (i === answers.rows.length - 1) {
//       // console.log('here', currAnswer);
//       answerResults.push(currAnswer);
//     }
//   }

//   let allAnswerResults = answerResults.slice(offset, offset + count);

//   let results = {
//     question: question_id.toString(),
//     page: page,
//     count: count,
//     results: allAnswerResults
//     // results: answerResults
//   };

//   res.status(200).send(results);
// };


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

    // use left join query + getAnswersFn
    // let queryA = 'SELECT a.id as answer_id, question_id, body, date_written as date, answerer_name, helpful as helpfulness, ap.id as ap_id, ap.answer_id as ap_answer_id, url FROM answers a LEFT JOIN answers_photos ap ON ap.answer_id=a.id WHERE question_id=$1 and reported=false group by a.id, ap.id;';
    // getAnswersFn(queryA, question_id, false, res, page, count, offset);

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

