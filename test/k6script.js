import http from 'k6/http';
import { check, sleep } from 'k6';


// export default function () {
//   http.get('http://localhost:3030/qa/questions/606/answers');
//   http.get('http://localhost:3030/qa/questions?product_id=188');
//   sleep(1);
// }


// export default function () {
//   for (let i = 0; i < 5000; i++) {
//     http.get(`http://localhost:3030/qa/questions/${i}/answers`);
//     http.get(`http://localhost:3030/qa/questions?product_id=${i}`);
//   }
//   sleep(1);
// }


// export let options = {
//   vus: 1000,
//   duration: '30s',
// };
// export default function () {
//   for (let i = 0; i < 50; i++) {
//     http.get(`http://localhost:3030/qa/questions/${i}/answers`);
//     http.get(`http://localhost:3030/qa/questions?product_id=${i}`);
//   }
//   sleep(1);
// }


// // ramping up/down VUs
// export let options = {
//   stages: [
//     { duration: '30s', target: 1000 },
//     { duration: '1m30s', target: 1000 },
//     { duration: '30s', target: 2000 },
//   ],
// };

// export default function () {
//   for (let i = 1; i < 200; i++) {
//     let resA = http.get(`http://localhost:3030/qa/questions/${i}/answers`);
//     check(resA, { 'status was 200': (r) => r.status == 200 });
//     let resQ = http.get(`http://localhost:3030/qa/questions?product_id=${i}`);
//     check(resQ, { 'status was 200': (r) => r.status == 200 });
//   }
//   sleep(1);
// }

// // ramping up/down VUs
// export let options = {
//   stages: [
//     { duration: '10s', target: 1000 },
//     { duration: '1m30s', target: 1000 },
//     { duration: '20s', target: 2000 },
//     { duration: '20s', target: 0 },
//   ],
// };

// export default function () {
//   let i = parseInt(Math.random()*100000);
//   let resA = http.get(`http://localhost:3030/qa/questions/${i}/answers`);
//   check(resA, { 'status was 200': (r) => r.status == 200 });
//   let resQ = http.get(`http://localhost:3030/qa/questions?product_id=${i}`);
//   check(resQ, { 'status was 200': (r) => r.status == 200 });

//   sleep(1);
// }



// export let options = {
//   discardResponseBodies: true,
//   scenarios: {
//     contacts: {
//       executor: 'ramping-arrival-rate',
//       startRate: 10,
//       timeUnit: '1s',
//       preAllocatedVUs: 100,
//       maxVUs: 2000,
//       stages: [
//         { duration: '30s', target: 1000 },
//         { duration: '1m30s', target: 1000 },
//         { duration: '30s', target: 2000 },
//       ],
//     },
//   },
// };

// export default function () {
//   http.get('http://localhost:3030/qa/questions/606/answers');
//   http.get('http://localhost:3030/qa/questions?product_id=188');
// }


export let options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 1000, // RPS, since timeUnit is the default 1s. Can adjust timeUnit.
      // timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 50,
      maxVUs: 1000,  // needs to be high enough for rate
    },
  },
};

export default function () {
  let max = 1000000;  // product_id for resQ
  let min = 900000;   // product_id for resQ
  let i = parseInt(Math.random() * (max - min) + min);
  let resQ = http.get(`http://localhost:3030/qa/questions?product_id=${i}`);
  check(resQ, { 'getQuestions status was 200': (r) => r.status == 200 });
}

// export default function () {
//   let max = 3510000;  // question_id for resA
//   let min = 3160000;  // question_id for resA
//   let i = parseInt(Math.random() * (max - min) + min);
//   let resA = http.get(`http://localhost:3030/qa/questions/${i}/answers`);
//   check(resA, { 'getAnswers status was 200': (r) => r.status == 200 });
// }
