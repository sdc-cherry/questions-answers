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

// const getProductTb = (req, res) => {
//   pool.query('select * from product where id=188', (error, results) => {
//     if (error) {
//       // throw error;
//       res.status(500).send({message: err.message});
//     }
//     res.status(200).json(results.rows)
//   })
// };
const getProductTb = async(req, res) => {
  try {
    const results = await pool.query('select * from product where id=188');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};


// const getQuestionsTb = (req, res) => {
//   pool.query('select * from questions where product_id=188 order by id ASC', (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).json(results.rows)
//   })
// };
const getQuestionsTb = async(req, res) => {
  try {
    const results = await pool.query('select * from questions where product_id=188 order by id ASC');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};


// const getAnswersTb = (req, res) => {
//   pool.query('select * from answers where question_id=607 order by id ASC', (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).json(results.rows)
//   })
// };
const getAnswersTb = async(req, res) => {
  try {
    const results = await pool.query('select * from answers where question_id=607 order by id ASC');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};


// const getAnswers_photosTb = (req, res) => {
//   pool.query('select * from answers_photos where answer_id=1202', (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).json(results.rows)
//   })
// };
const getAnswers_photosTb = async(req, res) => {
  try {
    const results = await pool.query('select * from answers_photos where answer_id=1202');
    res.status(200).send(results.rows);
  } catch (err) {
    res.status(500).send({message: err.message});
  }
};


// const getCheckTb = (req, res) => {
//   let query = "SELECT q.id as q_id, product_id, q.body, q.date_written, asker_name, asker_email, q.reported as q_reported, q.helpful as q_helpful, a.id as a_id, question_id, a.body as a_body, a.date_written as a_date_written, answerer_name, answerer_email, a.reported as a_reported, a.helpful as a_helpful, ap.id as ap_id, answer_id, url FROM questions q INNER JOIN answers a ON question_id = q.id INNER JOIN answers_photos ap ON answer_id = a.id WHERE product_id = 188 ORDER by ap.id ASC;";

//   pool.query(query, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     // console.log(results.rows[1].id);
//     res.status(200).json(results.rows)
//   })
// };
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
// const getProducts = (req, res) => {
//   pool.query('select * from product where id=188', (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).json(results.rows)
//   })
// };
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
// const getQuestions = (req, res) => {
//   pool.query('select * from questions where product_id=188 order by id ASC', (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).json(results.rows)
//   })
// };
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
// const addQuestion = (req, res) => {
//   console.log('req.body', req.body);

//   const { product_id, body, asker_name, asker_email } = req.body;
//   const query = 'INSERT INTO questions (product_id, body, asker_name, asker_email) VALUES ($1, $2, $3, $4) RETURNING id';
//   const value = [product_id, body, asker_name, asker_email];

//   pool.query(query, value, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     // res.status(201).send(`New question added for product_id: ${product_id}`);
//     res.status(201).send(`New question added with ID:${results.rows[0].id} `);
//   });
// }

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
// const getAnswers = (req, res) => {
//   pool.query('select * from answers where question_id=607 order by id ASC', (error, results) => {
//     if (error) {
//       throw error;
//     }
//     res.status(200).json(results.rows)
//   })
// };
const getAnswers = async(req, res) => {
  try {
    const results = await pool.query('select * from answers where question_id=$1 order by id ASC',[req.params.question_id]);
    res.status(200).send(results.rows);
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

