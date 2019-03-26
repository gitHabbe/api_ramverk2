process.env.NODE_ENV = 'test';

const request = require('supertest');
const server = require('../app.js');

describe('User', () => {
    describe('GET /invalid', () => {
        it('404 BAD PATH', async done => {
            const res = await request(server).get("/invalid");
            const exp = 404;
            expect(res.status).toBe(exp);
            done();
        });
    });
    describe('GET /', () => {
        it('200 HAPPY ROUTE:)', async done => {
            const res = await request(server).get("/");
            const exp = 200;
            expect(res.status).toBe(exp);
            done();
        });
    });
    describe('GET /figures', () => {
        it('200 HAPPY FIGURES:)', async done => {
            const data = await request(server).get("/figure/figures");
            const figures = JSON.parse(data.text);
            const res = figures.length;
            const exp = 2;
            expect(res).toBe(exp);
            done();
        })
    });
    describe('POST /user/register', () => {
        it('200 HAPPY REGISTRATION:)', async done => {
            const data = await request(server).post("/user/register")
                .send({username: "tester", password: "testing", password2: "testing"});
            const res = data.status;
            const exp = 201;
            expect(res).toBe(exp);
            done();
        });
        it('422 NO PASSWORD MATCH:(', async done => {
            const data = await request(server).post("/user/register")
                .send({username: "testerrr", password: "testing", password2: "tttestinggg"});
            const res = data.status;
            const exp = 422;
            expect(res).toBe(exp);
            done();
        });
        it('409 USERNAME TAKEN:(', async done => {
            const data = await request(server).post("/user/register")
                .send({username: "tester", password: "test", password2: "test"});
            const res = data.status;
            const exp = 409;
            expect(res).toBe(exp);
            done();
        });
    });
    describe('POST /user/login', () => {
        it('200 HAPPY LOGIN:)', async done => {
            const data = await request(server).post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const res = data.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('404 USER DOESNT EXIST', async done => {
            const data = await request(server).post("/user/login")
                .send({username: "tester1337", password: "testing", password2: "testing"});
            const res = data.status;
            const exp = 404;
            expect(res).toBe(exp);
            done();
        });
        it('401 WRONG PASSOWRD', async done => {
            const data = await request(server).post("/user/login")
                .send({username: "tester", password: "teesting", password2: "teesting"});
            const res = data.status;
            const exp = 401;
            expect(res).toBe(exp);
            done();
        });
    });
    describe('POST /user TOKEN AUTH', () => {
        it('200 user token:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const data2 = await request(server)
                .post("/user/token")
                .send({token});
            let res = data2.status;
            let exp = 200;
            expect(res).toBe(exp);
            done();
            return;
            

        });
        it('404 no token:(', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const exp = token;
            const data3 = await request(server)
                .post("/user/token");
            const res = JSON.parse(data3.text).token;
            expect(res).not.toBe(exp);
            done();
        });
        it('200 buy figure:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const fakeFigure = {
                name: "Flash",
                value: 30
            };
            const user = {data: jsonData};
            const data4 = await request(server)
                .post("/user/buy")
                .send({user, figure: fakeFigure, count: 2})
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('200 buy figure:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const fakeFigure = {
                name: "Flash",
                value: 30
            };
            const user = {data: jsonData};
            const data4 = await request(server)
                .post("/user/buy")
                .send({user, figure: fakeFigure, count: 2})
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('200 sell figure:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const fakeFigure = {
                name: "Flash",
                value: 35
            };
            const user = {data: jsonData};
            const data4 = await request(server)
                .post("/user/sell")
                .send({user, figure: fakeFigure, count: 1})
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('200 /get-user:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const user = {data: jsonData};
            const data4 = await request(server)
                .post("/user/get-user")
                .send({user})
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('200 /purchases:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const user = {data: jsonData};
            const data4 = await request(server)
                .get("/user/purchases")
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('200 /figures:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const user = {data: jsonData};
            const data4 = await request(server)
                .get("/user/figures")
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('200 /deposit:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const user = {data: jsonData};
            const data4 = await request(server)
                .post("/user/deposit")
                .send({user, amount: 200})
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('200 /withdraw:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const user = {data: jsonData};
            const data4 = await request(server)
                .post("/user/withdraw")
                .send({user, amount: 300})
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).toBe(exp);
            done();
        });
        it('400 /withdraw:)', async done => {
            const data = await request(server)
                .post("/user/login")
                .send({username: "tester", password: "testing", password2: "testing"});
            const jsonData = JSON.parse(data.text);
            const token = jsonData.token;
            const user = {data: jsonData};
            const data4 = await request(server)
                .post("/user/withdraw")
                .send({user, amount: 1000})
                .set('x-access-token', token);
            const res = data4.status;
            const exp = 200;
            expect(res).not.toBe(exp);
            done();
        });
    });
});