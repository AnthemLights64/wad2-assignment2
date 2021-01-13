import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import api from "../../../../index";
import loglevel from 'loglevel';

const expect = chai.expect;

let db;
//let api;

const users = [
  {
    username: "user1",
    password: "test1",
  },
  {
    username: "user2",
    password: "test2",
  },
];

const sampleMovie = {
  id: 337401,
  title: "Mulan",
};

describe("Users endpoint", () => {
  before(() => {
    mongoose.connect(process.env.mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      loglevel.error(error);
    }
  });
  beforeEach(async () => {
    try {
      //api = require("../../../../index");
      await User.deleteMany({});
      await User.collection.insertMany(users);
    } catch (err) {
      loglevel.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
    delete require.cache[require.resolve("../../../../index")];
  });
  describe("GET /users ", () => {
    it("should return the 2 users and a status 200", (done) => {
      request(api)
        .get("/api/users")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(2);
          let result = res.body.map((user) => user.username);
          expect(result).to.have.members(["user1", "user2"]);
          done();
        });
    });
  });

  describe("POST / ", () => {
    describe("when the password is valid", () => {
      it("should return a status 200 and the confirmation message", () => {
        return request(api)
          .post("/api/users?action=register")
          .send({
            username: "user3",
            password: "test3",
          })
          .expect(201)
          .expect({ code: 201, msg: 'Successfully created new user.' });
      });
      after(() => {
        return request(api)
          .get("/api/users")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.equal(3);
            let result = res.body.map((user) => user.username);
            expect(result).to.have.members(["user1", "user2", "user3"]);
          });
      });
    })
    describe("when the password is invalid", () => {
      describe("the password has only numbers", () => {
        it("should return register failed message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user4",
              password: "666666",
            })
            .expect(401)
            .expect({code: 401, msg: 'Register failed for bad password.'});
        });
        after(() => {
          return request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.a("array");
              expect(res.body.length).to.equal(2);
              let result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2"]);
            });
        });
      });
      describe("the password has only characters", () => {
        it("should return register failed message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user4",
              password: "tttttt",
            })
            .expect(401)
            .expect({code: 401, msg: 'Register failed for bad password.'});
        });
        after(() => {
          return request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.a("array");
              expect(res.body.length).to.equal(2);
              let result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2"]);
            });
        });
      });
      describe("the length of password is less than 5", () => {
        it("should return register failed message", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({
              username: "user4",
              password: "a123",
            })
            .expect(401)
            .expect({code: 401, msg: 'Register failed for bad password.'});
        });
        after(() => {
          return request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.a("array");
              expect(res.body.length).to.equal(2);
              let result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2"]);
            });
        });
      });
      describe("nothing is inputed", () => {
        it("should return the message asking for input", () => {
          return request(api)
            .post("/api/users?action=register")
            .send({})
            .expect(401)
            .expect({success: false, msg: 'Please pass username and password.'});
        });
        after(() => {
          return request(api)
            .get("/api/users")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body).to.be.a("array");
              expect(res.body.length).to.equal(2);
              let result = res.body.map((user) => user.username);
              expect(result).to.have.members(["user1", "user2"]);
            });
        });
      });
    }); 
  });

  describe("PUT / ", () => {
    describe("when the input is valid", () => {
      it("should return a status 200 and the success message", () => {
        return request(api)
          .put("/api/users/user1")
          .send({
            username: "Allen",
            password: "WelongLu64"
          })
          .expect(200)
          .expect({ code: 200, msg: 'The user is successfully updated.' });
      });
      after(() => {
        return request(api)
          .get("/api/users")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.equal(2);
            let result = res.body.map((user) => user.username);
            expect(result).to.have.members(["Allen", "user2"]);
          });
      });
    });
    describe("when the input is invalid", () => {
      it("should return a status 401 and the wrong username message", () => {
        return request(api)
          .put("/api/users/userNodody")
          .send({
            username: "Allen",
            password: "WelongLu64"
          })
          .expect(401)
          .expect({ code: 401, msg: 'Invaild username.' });
      });
      after(() => {
        return request(api)
          .get("/api/users")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.equal(2);
            let result = res.body.map((user) => user.username);
            expect(result).to.have.members(["user1", "user2"]);
          });
      });
    });
  });

  describe("POST /userName/favourites", () => {
    describe("when the input is valid ", () => {
      it("should have the property 'favourites' and return a status 201", (done) => {
        request(api)
          .post("/api/users/user1/favourites")
          .send({
            id: `${sampleMovie.id}`,
            title: `${sampleMovie.title}`
          })
          .expect("Content-Type", /json/)
          .expect(201)
          .end((err, res) => {
            expect(res.body).to.have.property("favourites");
            done();
          });
      });
      after("it should have the moive id and title in favourites of user1", async () => {
        return request(api)
          .get("/api/users/user1/favourites")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(201)
          .then((res) => {
            let resultId = res.body.map((favourites) => favourites.id);
            expect(resultId).to.have.members([parseInt(`${sampleMovie.id}`)]);
            let resultTitle = res.body.map((favourites) => favourites.title);
            expect(resultTitle).to.have.members([`${sampleMovie.title}`]);
          });
      });
    });
    describe("when the input id is invalid", () => {
      it("should return the invaild id message", () => {
        request(api)
          .post("/api/users/user1/favourites")
          .send({
            id: `Hello`,
            title: `Anything`
          })
          .expect("Content-Type", /json/)
          .expect(401)
          .expect({ code: 401, msg: 'Invaild movie id.' });
      });
    });
  });

});
