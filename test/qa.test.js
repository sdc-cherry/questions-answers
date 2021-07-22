const cloneArray = require('./init');

test('properly clones array using toBe', () => {
  const array = [1,2,3];
  expect(cloneArray(array)).toEqual(array);
  expect(cloneArray(array)).toStrictEqual(array);
  expect(cloneArray(array)).not.toBe(array);
})

const request = require("supertest");
const app = require('../server/index.js')

// const mongoose = require ('mongoose');

// jest.setTimeout(15000);

describe("Test todo methods", () => {

//   it("should return all answers", async (done) => {
//     const response = await request(app).get("/sdc/answers")
//     expect(response.body.length).toBe(8);
//     done();
//   });


  it("should return searched product", async () => {
    await request(app)
    .get("/sdc/product")
    .expect(200)
    .then((response) => {
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("Jennie 50 Trousers");
    });
  });

  it("should return searched questions", async () => {
    await request(app)
    .get("/sdc/questions")
    .expect(200)
    .then((response) => {
        expect(response.body.length).toBe(6);
        expect(response.body[1].id).toBe(607);
        expect(response.body[1].body).toBe("Minima itaque quod minus assumenda possimus.");
    });
  });

  it("should return searched answers", async () => {
    await request(app)
    .get("/sdc/answers")
    .expect(200)
    .then((response) => {
        expect(response.body.length).toBe(3);
        expect(response.body[1].id).toBe(1202);
        expect(response.body[1].answerer_name).toBe("Minnie_Smitham");
    });
  });

  it("should return all answers_photos", async () => {
      await request(app)
      .get("/sdc/answers_photos")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(1);
        expect(response.body[0].id).toBe(351);
        expect(response.body[0].url).toBe("https://images.unsplash.com/photo-1556304653-cba65c59b3c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2761&q=80");
      });
  });



  it("should return serial check from product_id to answers_photos", async () => {
      await request(app)
      .get("/sdc/check")
      // .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(4);
        expect(response.body[1].question_id).toBe(607);
        expect(response.body[1].answerer_name).toBe("Minnie_Smitham");
        expect(response.body[1].url).toBe("https://images.unsplash.com/photo-1556304653-cba65c59b3c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2761&q=80");
      });
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
//     await app.delete()
//   })

// afterAll(async () => {
//     pgPool.end();
//     });

//   afterAll( async (done) =>{
//         app.close();
//         done()
//     })