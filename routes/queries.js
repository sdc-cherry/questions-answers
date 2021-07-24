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
    const results = await pool.query('SELECT q.id as q_id, product_id, q.body, q.date_written, asker_name, asker_email, q.reported as q_reported, q.helpful as q_helpful, a.id as a_id, question_id, a.body as a_body, a.date_written as a_date_written, answerer_name, answerer_email, a.reported as a_reported, a.helpful as a_helpful, ap.id as ap_id, answer_id, url FROM questions q INNER JOIN answers a ON question_id = q.id INNER JOIN answers_photos ap ON answer_id = a.id WHERE product_id = 188 ORDER by ap.id ASC;');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};


// REAL WORK //

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


// # '/qa/questions': questions.jsx. 'qa/questions?product_id=22122&page=1&count=5'
// app.get('/qa/questions?product_id=28212', db.getQuestions);
const getQuestions = async(req, res) => {
  try {
    // console.log('req.query', req.query);
    const results = await pool.query('select * from questions where product_id=$1 order by id ASC', [req.query.product_id]);
    res.status(200).send(results.rows);
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
    res.status(201).send(`New question added with ID:${newQuestion.rows[0].id} `);
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
  console.log(req.query);
  let page, count, queryA, valueA, offset;
  let query = 'select * from answers where question_id=$1 order by id ASC';
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
    if (page === 1) {
      offset = '';
    } else {
      offset = ' OFFSET ' + count * (page - 1);
    }
    let forQestion = false;
    // console.log(req.query.page, page, req.query.count, count)
    queryA = query + ' limit $2' + offset;
    valueA = [req.params.question_id, count];

    const answers = await pool.query(queryA, valueA);

    let photosPromises = [];
    let convertedAnswers = [];
    let results = {};
    for (let i = 0; i < answers.rows.length; i++) {
      photosPromises[i] = pool.query('select * from answers_photos where answer_id=$1', [answers.rows[i].id]);
    };
    Promise.all(photosPromises)
      .then( photosData => {
        // let allPhotos = photosData.map( photoData => (photoData.rows) )
        let allPhotos = photosData.map( photoData => {
          return photoData.rows.map( photoD => {
            let convertedPhoto = {
              id: photoD.id,
              url: photoD.url
            }
            return convertedPhoto;
          } )
        } );
        // console.log('allPhotos', allPhotos)
        convertedAnswers = allPhotos.map((photo, index) => {
          let answer = answers.rows[index];
          return {
            "answer_id": answer.id,
            "body": answer.body,
            "date": answer.date_written,
            "answerer_name": answer.answerer_name,
            "answerer_email": answer.answerer_email,
            "helpfulness": answer.helpful,
            "reported": answer.reported,
            "photos": photo
          }
        });
        results = {
          question: req.params.question_id.toString(),
          page: page,
          count: count,
          results: convertedAnswers
        };
        if (forQestion) {
          return results;
        } else {
          res.status(200).send(results);
        }
      } )
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
    console.log('req.body', req.body);
    const { body, name, email, photos } = req.body;
    const queryA = 'INSERT INTO answers (question_id, body, answerer_name, answerer_email) VALUES ($1, $2, $3, $4) RETURNING id';
    const valueA = [req.params.question_id, body, name, email];
    const queryP = 'INSERT INTO answers_photos (answer_id, url) VALUES ($1, $2)';

    let newAnswer = await pool.query(queryA, valueA);
    photos.forEach(url => {
      const valueP = [newAnswer.rows[0].id, url];
      pool.query(queryP, valueP);
    })

    res.status(201).send(`New answer added for answer_id: ${req.params.question_id}`);
  } catch (err) {
    // res.status(500).send({message: err.message});
    throw err;
  }
};

// # `/qa/answers/${this.props.answer.answer_id}/helpful`: answerEntry.jsx
// app.put('qa/answers/1992416/helpful', db.likeAnswer);
const likeAnswer = async(req, res) => {
  try {
    console.log('req.params.answer_id', req.params.answer_id);
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
    console.log('req.params.answer_id', req.params.answer_id);
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

