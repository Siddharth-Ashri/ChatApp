let request = require('request');
describe("calc", () => {

    it("should multiply 2 with 2", () => {
        expect(2 * 2).toBe(4);

    });
});

describe('message response', () => {
    it('should return a status of 200 ok', (done) => {
        request.get('http://localhost:3001/messages', (err, res) => {
            expect(JSON.parse(res.body).length).toBeGreaterThan(2);
            done();
        })
    })
})
// describe('message content check', () => {
//     it('should not contain the word ho', (done) => {
//         request.get('http://localhost:3001/messages', (err, res) => {
//             let messages = JSON.parse(res.body);
//             console.log(messages.forEach(element => {
//                expect(element.message).toContain('ho');
//             }));
//             done();

//         })
//     })
// })
describe('getting a message from a specific user', () => {
    it('should return 200 ok', (done) => {
        request.get("http://localhost:3001/messages/tim", (err, res) => {
            expect(res.statusCode).toEqual(200);
        })
        done();
    })
    it('should get messages only from the user tim', (done) => {
        request.get("http://localhost:3001/messages/tim", (err, res) => {
            // expect(JSON.parse(res.body[0].name)).toBe('tim');
            console.log(res.body);
        })
        done();
    })
})