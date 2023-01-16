import * as UserService from "./../services/User.service.js";
import { IUser } from "../Models/User";

test('Testing getUsers function With empty db', async () => {
    const users = await UserService.getUsers();
    expect(users).toEqual([]);
});

test('Testing addUser function', async () => {
    const user: IUser = {
        username: 'Vadim',
        age: 26,
        hobbies: []
    }
    await UserService.addUser(user);
    const users = await UserService.getUsers();

    expect(users[0]).toMatchObject(user);
    expect(users.length).toEqual(1);
});

test('Testing updateUser function', async () => {
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
    const addedUser = await UserService.addUser(user);
    const updatedUser = await UserService.updateUser(addedUser.id, userForUpdate);

    expect(updatedUser).toMatchObject(userForUpdate);
});
