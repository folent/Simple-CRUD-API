import { IUser } from "../models/User";
import request from "supertest";
import server from "./../index.js"

test('Get empty array of users', async () => {
    const response = await request(server).get('/api/users');
    
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual([] as IUser[]);
});

test('Add new user', async () => {
    const user: IUser = {
        username: 'Vadim',
        age: 26,
        hobbies: []
    }
    await request(server)
            .post('/api/users')
            .send(user);
    const users = await request(server).get('/api/users');

    expect(users.body[0]).toMatchObject(user);
    expect(users.body.length).toEqual(1);
});

test('Update user', async () => {
    const user: IUser = {
        username: 'Vadim',
        age: 26,
        hobbies: []
    }

    const userForUpdate: IUser = {
        username: 'Ilya',
        age: 26,
        hobbies: ['books', 'tv']
    }
    const resp = await request(server)
                        .post('/api/users')
                        .send(user);
    const respUpdate = await request(server)
                            .put('/api/users/' + resp.body.id)
                            .send(userForUpdate);

    expect(respUpdate.body).toMatchObject(userForUpdate);
});

afterAll((done: any) => {
    server.close();
    done();
  });