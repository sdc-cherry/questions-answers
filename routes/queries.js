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
    const results = await pool.query('SELECT q.id as q_id, product_id, q.body, q.date_written, asker_name, asker_email, q.reported as q_reported, q.helpful as q_helpful, a.id as a_id, question_id, a.body as a_body, a.date_written as a_date_written, answerer_name, answerer_email, a.reported as a_reported, a.helpful as a_helpful, ap.id as ap_id, answer_id, url FROM questions q LEFT JOIN answers a ON question_id = q.id LEFT JOIN answers_photos ap ON answer_id = a.id WHERE product_id = 188 ORDER by q.id ASC, a.id ASC, ap.id ASC;');

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


const getQuestions = async(req, res) => {
  try {
    const queryA = 'SELECT id, body, date_written as date, answerer_name, helpful as helpfulness from answers where question_id=$1 and reported=false order by id ASC';
    // const queryA = 'select * from answers where question_id=$1 order by id ASC';
    let question_idA, valueA;

    let answersPromises = [];
    let convertedQuestions = [];
    let allAnswers = [];
    let results = {};

    //
    // console.log(req.query);
    let page, count, queryQ, valueQ, offset;
    // let query = 'select * from questions where product_id=$1 and reported=false order by id ASC';
    let query = 'SELECT id as question_id, body as question_body, date_written as question_date, asker_name, helpful as question_helpfulness, reported from questions where product_id=$1 and reported=false order by id ASC';

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
    if (page === 1) {
      offset = '';
    } else {
      offset = ' OFFSET ' + count * (page - 1);
    }
    // console.log(req.query.page, page, req.query.count, count)
    queryQ = query + ' limit $2' + offset;
    let product_id = req.query.product_id;
    valueQ = [req.query.product_id, count];
    // getAnswersFn(queryQ, valueQ, false, question_idA, res, page, count, offset);
    //

    const questions = await pool.query(queryQ, valueQ);
    let allQuestions = questions.rows;

    for (let i = 0; i < questions.rows.length; i++) {
      question_idA = questions.rows[i].question_id;
      valueA = [question_idA];
      answersPromises[i] = getAnswersFn(queryA, valueA, true, question_idA);
    };

    // return Promise.all(answersPromises)
    // .then( answersData => {
    //   allAnswers = answersData.map( (answerData, index) => {
    //     // console.log('answerData', answerData.results)
    //     let convertedAnswer = {};
    //     answerData.results.forEach( answerD => {
    //       console.log('answerD', answerD)
    //       convertedAnswer[answerD.id] = answerD;
    //     } );
    //     let question = questions.rows[index];
    //     question.answers = convertedAnswer;
    //     convertedQuestions[index] = question;
    //   } );
    //   results = {
    //     product_id: req.query.product_id.toString(),
    //     results: convertedQuestions
    //   };
    //   res.status(200).send(results);
    // })

    return Promise.all(answersPromises)
    .then( answersData => {
      // allAnswers = answersData.map( (answerData, index) => {
      //   // console.log('answerData', answerData.results)
      //   // let convertedAnswer = {};
      //   // answerData.results.forEach( answerD => {
      //   //   console.log('answerD', answerD)
      //   //   convertedAnswer[answerD.id] = answerD;
      //   // } );
      //   let question = questions.rows[index];
      //   question.answers = answersData;
      //   convertedQuestions[index] = question;
      // } );
      results = {
        product_id: req.query.product_id.toString(),
        results: questions.rows.map((question, index)=>{
          question.answers = answersData[index].results;
          return question;
        })
      };

      res.status(200).send(results);
    })

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


const getAnswersFn = async(queryA, valueA, forQestion, question_id, res, page, count, offset) => {
  const answers = await pool.query(queryA, valueA);

  let photosPromises = [];
  let convertedAnswers = [];
  let results = {};
  for (let i = 0; i < answers.rows.length; i++) {
    let query = 'select id, url from answers_photos where answer_id=$1 order by id ASC';
    if (!forQestion) {
      photosPromises[i] = pool.query(query, [answers.rows[i].answer_id]);
    } else {
      photosPromises[i] = pool.query(query, [answers.rows[i].id]);
    }
  };
  return Promise.all(photosPromises)
    .then( photosData => {
      let convertedAnswersObj = {};

      convertedAnswers = photosData.map((photo, index) => {
        let answer = answers.rows[index];
        if (!forQestion) {
          answer.photos = photo.rows;
        } else {
          answer.photos = photo.rows.map(photo => (photo.url));
        }
        convertedAnswersObj[answer.id] = answer;
        return answer;
      });
      if (!forQestion) {
        ans = convertedAnswers;
      } else {
        ans = convertedAnswersObj;
      }
      results = {
        question: question_id.toString(),
        page: page,
        count: count,
        results: ans
      };
      if (!forQestion) {
        res.status(200).send(results);
      }
      return results;
    } )
};

// `/qa/questions/${this.props.questionId}/answers`: answerlist.jsx
// app.get('/qa/questions/213336/answers', db.getAnswers);
const getAnswers = async(req, res) => {
  // console.log(req.query);
  let page, count, queryA, valueA, offset;
  // let query = 'select * from answers where question_id=$1 and reported=false order by id ASC';
  let query = 'SELECT id as answer_id, body, date_written as date, answerer_name, helpful as helpfulness from answers where question_id=$1 and reported=false order by id ASC';


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
    // console.log(req.query.page, page, req.query.count, count)
    queryA = query + ' limit $2' + offset;
    let question_idA = req.params.question_id;
    valueA = [req.params.question_id, count];

    getAnswersFn(queryA, valueA, false, question_idA, res, page, count, offset);
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

