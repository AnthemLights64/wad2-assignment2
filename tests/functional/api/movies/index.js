import chai from "chai";
import request from "supertest";
import loglevel from 'loglevel';
import userModel from "../../../../api/users/userModel";
import {users} from '../../../../seedData/index.js';
import movieModel from "../../../../api/movies/movieModel";
import {movies} from '../../../../seedData/movies.js';

const expect = chai.expect;

let api;
let token;

const sampleMovie = {
  id: 337401,
  title: "Mulan",
};

describe("Movies endpoint", () => {
  describe("Authorized", () => {
    beforeEach(async () => {
      try {
        api = require("../../../../index");
        await userModel.deleteMany();
        await userModel.collection.insertMany(users);
      } catch (err) {
        loglevel.info(`failed to Load user Data: ${err}`);
      }
      try {
        await movieModel.deleteMany();
        await movieModel.collection.insertMany(movies);
        loglevel.info(`${movies.length} Movies were successfully stored.`);
      } catch (err) {
        loglevel.info(`failed to Load movie Data: ${err}`);
      }
      return request(api)
          .post("/api/users")
          .send({
            username: "user1",
            password: "test1",
          })
          .expect(200)
          .then((res) => {
            token = res.body.token;
          });
    });
    afterEach(() => {
      api.close(); // Release PORT 8080
      delete require.cache[require.resolve("../../../../index")];
    });

    describe("GET /movies ", () => {
      it("should return 20 movies and a status 200", (done) => {
        request(api)
          .get("/api/movies")
          .set("Authorization", token)
          .expect("Content-Type", /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.equal(20);
            done();
          });
      });
    });

    describe("GET /movies/:id", () => {
      describe("when the id is valid", () => {
        it("should return the matching movie", () => {
          return request(api)
            .get(`/api/movies/${sampleMovie.id}`)
            .set("Authorization", token)
            .expect("Content-Type", /json/)
            .expect(200)
            .then((res) => {
              expect(res.body).to.have.property("title", sampleMovie.title);
            });
        });
      });
      describe("when the id is invalid", () => {
        describe("the id is not a number", () => {
          it("should return a message that the input is not a number", () => {
            return request(api)
              .get(`/api/movies/xxxx`)
              .set("Authorization", token)
              .expect("Content-Type", /json/)
              .expect(404)
              .expect({ code: 404, msg: "The id should be a number." });
          });
        });
        describe("the id is a number but can not be found", () => {
          it("should return a message that the movie cannot be found", () => {
            return request(api)
              .get(`/api/movies/19990604`)
              .set("Authorization", token)
              .expect("Content-Type", /json/)
              .expect(404)
              .expect({ code: 404, msg: "The movie could not be found." });
          });
        });
      });
    });

    describe("POST /movies", () => {
      describe("when the input is valid", () => {
        describe("and the input includes only title", () => {
          it("should return the new movie added with a random id and a status 201", () => {
            return request(api)
              .post("/api/movies")
              .set("Accept", "application/json")
              .set("Authorization", token)
              .send({
                title: "TimeFlyer"
              })
              .expect(201)
              .then((res) => {
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("title","TimeFlyer");
              });
          });
        });
        describe("and the input includes title and id", () => {
          it("should return the new movie added and a status 201", () => {
            return request(api)
              .post("/api/movies")
              .set("Accept", "application/json")
              .set("Authorization", token)
              .send({
                id: 666666,
                title: "TimeFlyer"
              })
              .expect(201)
              .then((res) => {
                expect(res.body).to.have.property("id",666666);
                expect(res.body).to.have.property("title","TimeFlyer");
              });
          });
        });
        describe("and the input includes title and any other information", () => {
          it("should return the new movie added and a status 201", () => {
            return request(api)
              .post("/api/movies")
              .set("Accept", "application/json")
              .set("Authorization", token)
              .send({
                id: 7777777,
                title: "TimeFlyer",
                popularity: 100
              })
              .expect(201)
              .then((res) => {
                expect(res.body).to.have.property("id",7777777);
                expect(res.body).to.have.property("title","TimeFlyer");
                expect(res.body).to.have.property("popularity",100);
              });
          });
        });
      });
      describe("when the input is invalid", () => {
        describe("the input does not include title", () => {
          it("should return the message asking for a tilte", () => {
            return request(api)
              .post("/api/movies")
              .set("Accept", "application/json")
              .set("Authorization", token)
              .send({
                id: 666666,
                popularity: 100
              })
              .expect(405)
              .expect({ 
                status: 405,
                message: "Please include a title." 
              });
          });
        });
        describe("the input includes nothing", () => {
          it("should return the message for asking a title", () => {
            return request(api)
              .post("/api/movies")
              .set("Accept", "application/json")
              .set("Authorization", token)
              .send({})
              .expect(405)
              .expect({ 
                status: 405,
                message: "Please include a title." 
              });
          });
        });
      });
    });

    describe("PUT /movies/:id", () => {
      describe("when the input id is valid", () => {
          describe("and the id can be found", () => {
            describe("while the request payload includes title", () => {
              it("should return the updated info and a status 200", () => {
                return request(api)
                  .put(`/api/movies/${sampleMovie.id}`)
                  .set("Accept", "application/json")
                  .set("Authorization", token)
                  .send({
                    title: "Mulan updated"
                  })
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then((res) => {
                    expect(res.body).to.have.property("title","Mulan updated");
                  });
              });
              after(()=>{
                return request(api)
                  .get(`/api/movies/${sampleMovie.id}`)
                  .set("Accept", "application/json")
                  .set("Authorization", token)
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then((res) => {
                    expect(res.body).to.have.property("title","Mulan updated");
                  });
              });
            });
            describe("while the request payload includes title and more properties", () => {
              it("should return the updated info and a status 200", () => {
                return request(api)
                  .put(`/api/movies/${sampleMovie.id}`)
                  .set("Accept", "application/json")
                  .set("Authorization", token)
                  .send({
                    title: "Mulan updated",
                    genre_ids: [
                      28,
                      14,
                      878
                    ],
                    release_date: "2021-01-01"
                  })
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then((res) => {
                    expect(res.body).to.have.property("title","Mulan updated");
                    expect(res.body).to.have.property("genre_ids");
                    expect(res.body).to.have.property("release_date","2021-01-01");
                  });
              });
              after(()=>{
                return request(api)
                  .get(`/api/movies/${sampleMovie.id}`)
                  .set("Accept", "application/json")
                  .set("Authorization", token)
                  .expect("Content-Type", /json/)
                  .expect(200)
                  .then((res) => {
                    expect(res.body).to.have.property("title","Mulan updated");
                    expect(res.body).to.have.property("genre_ids");
                    expect(res.body).to.have.property("release_date","2021-01-01");
                  });
              });
            });
          });

          describe("and the id cannot be found", () => {
            it("should return the message of unable to find movie and a status 404", () => {
              return request(api)
                .put(`/api/movies/123321`)
                .set("Accept", "application/json")
                .set("Authorization", token)
                .send({
                  title: "Updated Title"
                })
                .expect("Content-Type", /json/)
                .expect(404)
                .expect({
                  message: 'Unable to find Movie',
                  status: 404
                });
            });
          });
      });
      describe("when the input id is invalid", () => {
        it("should return the message of invalid id and a status 200", () => {
          return request(api)
            .put(`/api/movies/xxxx`)
            .set("Accept", "application/json")
            .set("Authorization", token)
            .send({
              title: "Mulan updated"
            })
            .expect("Content-Type", /json/)
            .expect(404)
            .then((res) => {
              expect({
                status: 404,
                msg: "The id is invalid."
              });
            });
        });
      });
    });

    describe("DELETE /movies/:id", () => {
      describe("when the input id is valid", () => {
        describe("and the id can be found", () => {
          it("should return the success message and a status 200", () => {
            return request(api)
              .delete(`/api/movies/${sampleMovie.id}`)
              .set("Authorization", token)
              .expect("Content-Type", /json/)
              .expect(200)
              .expect({
                message: `Deleted movie id: ${sampleMovie.id}.`,
                status: 200
              });
          });
          after(() => {
            return request(api)
              .get(`/api/movies/${sampleMovie.id}`)
              .set("Accept", "application/json")
              .set("Authorization", token)
              .expect(404)
              .expect({ code: 404, msg: "The movie could not be found." });
          });
        });
        describe("and the id cannot be found", () => {
          it("should return the message of unable to find movie and a status 404", () => {
            return request(api)
              .delete(`/api/movies/957369`)
              .set("Authorization", token)
              .expect("Content-Type", /json/)
              .expect(404)
              .expect({
                message: `Unable to find movie with id: 957369.`, 
                status: 404
              });
          });
        });
      });
      describe("when the input id is invalid", () => {
        it("should return the message of invalid id", () => {
          return request(api)
            .delete(`/api/movies/xxxx`)
            .set("Accept", "application/json")
            .set("Authorization", token)
            .expect("Content-Type", /json/)
            .expect(404)
            .expect({
              status: 404,
              msg: "The id is invalid."
            });
        });
      });
    });
  });

  describe("Unauthorized", () => {
    beforeEach(async () => {
      try {
        api = require("../../../../index");
        await movieModel.deleteMany({});
        await movieModel.collection.insertMany(users);
      } catch (err) {
        loglevel.info(`failed to Load user Data: ${err}`);
      }
    });
    afterEach(() => {
      api.close();
      delete require.cache[require.resolve("../../../../index")];
    });
    describe("GET /movies", () => {
      it("should a status 401 of unauthorized", () => {
        request(api)
          .get("/api/movies")
          .expect(401);
      });
    });
    describe("GET /movies/:id", () => {
      it("should a status 401 of unauthorized", () => {
        request(api)
          .get(`/api/movies/${sampleMovie.id}`)
          .expect(401);
      });
    });
    describe("POST /movies", () => {
      it("should a status 401 of unauthorized", () => {
        request(api)
          .post("/api/movies")
          .set("Accept", "application/json")
          .send({
            title: "TimeFlyer"
          })
          .expect(401);
      });
    });
    describe("PUT /movies/:id", () => {
      it("should a status 401 of unauthorized", () => {
        request(api)
          .put(`/api/movies/${sampleMovie.id}`)
          .set("Accept", "application/json")
          .send({
            title: "Mulan Updated"
          })
          .expect(401);
      });
    });
    describe("DELETE /movies/:id", () => {
      it("should a status 401 of unauthorized", () => {
        request(api)
          .delete(`/api/movies/${sampleMovie.id}`)
          .expect(401);
      });
    });
  });
  

});
