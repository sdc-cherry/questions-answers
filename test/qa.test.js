// const cloneArray = require('./init');

// test('properly clones array using toBe', () => {
//   const array = [1,2,3];
//   expect(cloneArray(array)).toEqual(array);
//   expect(cloneArray(array)).toStrictEqual(array);
//   expect(cloneArray(array)).not.toBe(array);
// })

const request = require("supertest");
const server = require('../server/index.js');

// const mongoose = require ('mongoose');

// jest.setTimeout(15000);
const fs = require('fs').promises;
let newQuestionId, newAnswerId;

describe("Test DB and Relations", () => {

  it("should return searched product", async () => {
    await request(server)
    .get("/sdc/product")
    .expect(200)
    .then((response) => {
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("Jennie 50 Trousers");
    });
  });

  it("should return searched questions", async () => {
    await request(server)
    .get("/sdc/questions")
    .expect(200)
    .then((response) => {
        // expect(response.body.length).toBe(6);
        expect(response.body[1].id).toBe(607);
        expect(response.body[1].body).toBe("Minima itaque quod minus assumenda possimus.");
    });
  });

  it("should return searched answers", async () => {
    await request(server)
    .get("/sdc/answers")
    .expect(200)
    .then((response) => {
        expect(response.body.length).toBe(3);
        expect(response.body[1].id).toBe(1202);
        expect(response.body[1].answerer_name).toBe("Minnie_Smitham");
    });
  });

  it("should return all answers_photos", async () => {
      await request(server)
      .get("/sdc/answers_photos")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe(351);
        expect(response.body[0].url).toBe("https://images.unsplash.com/photo-1556304653-cba65c59b3c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2761&q=80");
      });
  });



  it("should return serial check from product_id to answers_photos", async () => {
      await request(server)
      .get("/sdc/check")
      .expect(200)
      .then((response) => {
        // expect(response.body.length).toBe(4);
        expect(response.body[0].question_id).toBe(606);
        expect(response.body[0].answerer_name).toBe("Robb.Bogisich53");
        expect(response.body[0].url).toBe("https://images.unsplash.com/photo-1485646979142-d4abb57a876f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80");
      });
  });

});

describe("Test SDC APIs", () => {

  it("should return searched product", async () => {
    await request(server)
    .get("/products")
    .expect(200)
    .then((response) => {
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("Jennie 50 Trousers");
    });
  });

  it("should return searched questions in the correct data format", async () => {
    await request(server)
    .get("/qa/questions?product_id=188&page=1&count=4")
    .expect(200)
    .then((response) => {
        // expect(response.body.results.length).toBe(4);
        expect(response.body.results.[1].question_id).toBe(607);
        expect(response.body.results.[1].question_body).toBe("Minima itaque quod minus assumenda possimus.");
    });
  });


  it("post a new question", async () => {
    let newQuestionId;

    const newQuestion = {
      "product_id": 188,
      "body": "Is it from France???",
      "name": "Asker",
      "email": "asker@gmail.com"
    };

    await request(server)
    .post("/qa/questions?product_id=188")
    .set('Content-Type', 'application/json')
    .send(newQuestion)
    .expect(201)
    .then((response) => {
      expect(response.text).toContain("New question added with ID: 351");
      newQuestionId = response.text.split(':')[1];
      // console.log('newQuestionId', newQuestionId, typeof(newQuestionId));
      fs.writeFile('./test/output.txt', newQuestionId, (err) => {
        if (err) throw err;
        // console.log('updated!')
      });
    });
  });

  it("flag a question as helpful", async () => {
    const newQuestionId = await fs.readFile('./test/output.txt', 'utf8');
    // console.log('newQuestionId', newQuestionId);
    return request(server)
    .put(`/qa/questions/${newQuestionId}/helpful`)
    // .put(`/qa/questions/3519013/helpful`)
    .expect(204);
  });

  it("report a question", async () => {
    const newQuestionId = await fs.readFile('./test/output.txt', 'utf8');
    // console.log('newQuestionId', newQuestionId);
    return request(server)
    .put(`/qa/questions/${newQuestionId}/report`)
    // .put(`/qa/questions/3519013/helpful`)
    .expect(204);
  });

  it("should return searched answers in the correct data format", async () => {
    await request(server)
    .get("/qa/questions/607/answers")
    .expect(200)
    .then((response) => {
        expect(response.body.results.length).toBe(3);
        expect(response.body.results[1].answer_id).toBe(1202);
        expect(response.body.results[1].answerer_name).toBe("Minnie_Smitham");
    });
  });

  it("post a new answer", async () => {
    let newAnswerId;

    const newAnswer = {
      "body": "Teeeeest answer to be posted",
      "name": "Answer person",
      "email": "answerer@gmail.com",
      "photos": ["https://1test", "https://2test", "https://3test"]
    }

    await request(server)
    .post("/qa/questions/3518987/answers")
    .set('Content-Type', 'application/json')
    .send(newAnswer)
    .expect(201)
    .then((response) => {
      expect(response.text).toContain("New answer added with ID: 687");
      newAnswerId = response.text.split(':')[1];
      // console.log('newQuestionId', newAnswerId, typeof(newAnswerId));
      fs.writeFile('./test/output.txt', newAnswerId, (err) => {
        if (err) throw err;
        // console.log('updated!');
      });
    });
  });

  it("flag an answer as helpful", async () => {
    const newAnswerId = await fs.readFile('./test/output.txt', 'utf8');
    // console.log('newQuestionId', newAnswerId)
    return request(server)
    .put(`/qa/answers/${newAnswerId}/helpful`)
    // .put(`/qa/questions/3519013/helpful`)
    .expect(204);
  });

  it("report an answer", async () => {
    const newAnswerId = await fs.readFile('./test/output.txt', 'utf8');
    // console.log('newQuestionId', newAnswerId);
    return request(server)
    .put(`/qa/answers/${newAnswerId}/report`)
    // .put(`/qa/questions/3519013/helpful`)
    .expect(204);
  });

});

// // // const mongoose = require('mongoose')
// // // describe(' ...... ', ()=>{
// // //     expect(true).toBe(true)
//   afterAll( async () =>{
//         await mongoose.disconnect();
//     })
// // // })

// afterAll(async () => {
//     await server.delete()
//   })

// afterAll(async () => {
//     pgPool.end();
//     });

//   afterAll( async (done) =>{
//         server.close();
//         done()
//     })