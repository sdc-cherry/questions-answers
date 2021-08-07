import http from 'k6/http';
import { check, sleep } from 'k6';

// export let options = {
//   discardResponseBodies: true,
//   scenarios: {
//     contacts: {
//       executor: 'constant-arrival-rate',
//       rate: 1, // RPS, since timeUnit is the default 1s. Can adjust timeUnit.
//       // timeUnit: '1s',
//       duration: '1m',
//       preAllocatedVUs: 50,
//       maxVUs: 1000,  // needs to be high enough for rate
//     },
//   },
// };


// // getQuestions
// export default function () {
//   let max = 1000000;  // product_id for resQ
//   let min = 900000;   // product_id for resQ
//   let i = parseInt(Math.random() * (max - min) + min);
//   let resQ = http.get(`http://localhost:3030/qa/questions?product_id=${i}`);
//   check(resQ, { 'getQuestions status was 200': (r) => r.status == 200 });
// }

// // getAnswers
// export default function () {
//   let max = 3510000;  // question_id for resA
//   let min = 3160000;  // question_id for resA
//   let i = parseInt(Math.random() * (max - min) + min);
//   let resA = http.get(`http://localhost:3030/qa/questions/${i}/answers`);
//   check(resA, { 'getAnswers status was 200': (r) => r.status == 200 });
// }


// // addQuestion
// export default function () {
//   let max = 10000;  // product_id for resQ
//   let min = 1;   // product_id for resQ
//   let i = parseInt(Math.random() * (max - min) + min);
//   const url = `http://localhost:3030/qa/questions?product_id=${i}`;
//   const payload = JSON.stringify({
//     "product_id": i,
//     "body": "Is it good for AskerK6?",
//     "name": "AskerK6",
//     "email": "askerK6@gmail.com"
//   });
//   const params = {
//     headers: {'Content-Type': 'application/json'},
//   };
//   let resQ = http.post(url, payload, params);
//   check(resQ, { 'addQuestion status was 201': (r) => r.status == 201 });
// }
// // WITH new_q as (SELECT * FROM questions WHERE id>3519200) SELECT (SELECT COUNT(*) FROM new_q) as new_q_ct, (SELECT id FROM new_q group by id order by id ASC limit 1) as min, (SELECT id FROM new_q group by id order by id DESC limit 1) as max;
// // DELETE FROM questions WHERE id>3519200;


// // Like Question
// export default function () {
//   let max = 3605327;  // question_id for resQ
//   let min = 3538868;   // question_id for resQ
//   let i = parseInt(Math.random() * (max - min) + min);
//   let resQ = http.put(`http://localhost:3030/qa/questions/${i}/helpful`);
//   check(resQ, { 'likeQuestion status was 204': (r) => r.status == 204 });
// }
// // // SELECT (select count(*) from questions where id>3519200 and helpful>0) as new_helpful_q;
// // // update questions set helpful=0 where id>3519200;


// // Report Question
// export default function () {
//   let max = 3605327;  // question_id for resQ
//   let min = 3538868;   // question_id for resQ
//   let i = parseInt(Math.random() * (max - min) + min);
//   let resQ = http.put(`http://localhost:3030/qa/questions/${i}/report`);
//   check(resQ, { 'reportQuestion status was 204': (r) => r.status == 204 });
// }
// // // SELECT (select count(*) from questions where id>3519200 and reported=true) as new_reported_q;
// // // // update questions set reported=false where id>3519200;



// // addAnswer
// export default function () {
//   let max = 3605327;  // question_id for resA
//   let min = 3538868;   // question_id for resA
//   let i = parseInt(Math.random() * (max - min) + min);
//   const url = `http://localhost:3030/qa/questions/${i}/answers`;
//   const payload1 = JSON.stringify({
//     "body": "K61 Test answer to be posted",
//     "name": "K61Answer person",
//     "email": "K61answerer@gmail.com",
//     "photos": []
//   });
//   const payload2 = JSON.stringify({
//     "body": "K62 Test answer to be posted",
//     "name": "K62Answer person",
//     "email": "K62answerer@gmail.com",
//     "photos": ["https://K62_test1.com", "https://K62_test2.com"]
//   });
//   const params = { headers: {'Content-Type': 'application/json'}, };
//   let resA1 = http.post(url, payload1, params);
//   let resA2 = http.post(url, payload2, params);
//   check(resA1, { 'addAnswers wo photos status was 201': (r) => r.status == 201 });
//   check(resA2, { 'addAnswers w photos status was 201': (r) => r.status == 201 });
// }
// // WITH new_a as (SELECT * FROM answers WHERE id>6879498), new_ap as (SELECT * FROM answers_photos WHERE id>2064304) SELECT (SELECT COUNT(*) FROM new_a) as new_a_ct, (SELECT id FROM new_a group by id order by id ASC limit 1) as min_a, (SELECT id FROM new_a group by id order by id DESC limit 1) as max_a, (SELECT COUNT(*) FROM new_ap) as new_ap_ct, (SELECT id FROM new_ap group by id order by id ASC limit 1) as min_ap, (SELECT id FROM new_ap group by id order by id DESC limit 1) as max_ap;
// // // DELETE FROM answers_photos WHERE id>2064304;
// // // DELETE FROM answers WHERE id>6879498;


// // Like Answer
// export default function () {
//   let max = 7012268;  // answer_id for resA
//   let min = 6879547;   // answer_id for resA
//   let i = parseInt(Math.random() * (max - min) + min);
//   let resQ = http.put(`http://localhost:3030/qa/answers/${i}/helpful`);
//   check(resQ, { 'likeAnswer status was 204': (r) => r.status == 204 });
// }
// // // SELECT (select count(*) from answers where id>6879498 and helpful>0) as new_helpful_a;
// // // update answers set helpful=0 where id>6879498;


// Report Answer
export let options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 1000, // RPS, since timeUnit is the default 1s. Can adjust timeUnit.
      duration: '1m',
      preAllocatedVUs: 50,
      maxVUs: 1000,  // needs to be high enough for rate
    },
  },
};
export default function () {
  let max = 7012268;  // answer_id for resA
  let min = 6879547;   // answer_id for resA
  let i = parseInt(Math.random() * (max - min) + min);
  let resA = http.put(`http://localhost:3030/qa/answers/${i}/report`);
  check(resA, { 'reportAnswer status was 204': (r) => r.status == 204 });
}
// // SELECT (select count(*) from answers where id>6879498 and reported=true) as new_reported_a;
// // // update answers set reported=false where id>6879498;