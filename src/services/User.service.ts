import { IUser } from "../models/User";
import { v4 as uuid } from 'uuid';
import { IncomingMessage } from "http";

let users: IUser[] = []

export const getUsers = async () => {
    return users
}

export const getUserFromBody = async (req: IncomingMessage):Promise<IUser> => {
    return new Promise((resolve, reject) => {
        let body = "";
        let user: IUser;
        req.on('data', function (chunk: string) {
            body += chunk.toString();
        });
        req.on('end', function () {
            user = JSON.parse(body) as IUser;
            if (!user.age || !user.username || !Array.isArray(user.hobbies)) {
                reject({
                    statusCode: 400,
                    message: 'Please fill require fields'
                })
            }
            resolve(user);
        })
    })
}

export const addUser = async (user: IUser):Promise<IUser>  => {
    return new Promise((resolve) => {
        const newUser: IUser = {
            id: uuid(),
            ...user
        }

        users.push(newUser);
        resolve(newUser);
    })
}

export const getUser = async (id: string) => {
    return new Promise((resolve, reject) => {
        const user = users.find(u => u.id === id);

        if (user) {
            resolve(user);
        }
        reject({
            statusCode: 404,
            message: 'user is not found'
        })
    })
}

export const updateUser = async (id: string | undefined, user: IUser) => {
    return new Promise((resolve, reject) => {
        const userIdx = users.findIndex(u => u.id === id);

        if (userIdx > -1) {
            users[userIdx] = {id, ...user}
            resolve(users[userIdx]);
        } else {
            reject({
                statusCode: 404,
                message: 'user is not found'
            })
        }

        resolve(user);
    })
}

export const deleteUser = async (id: string) => {
    return new Promise((resolve, reject) => {
        const user = users.findIndex(u => u.id === id);

        if (user) {
            users = users.filter(u => u.id !== id);
            resolve({
                message: 'user has been deleted'
            });
        } else {
            reject({
                statusCode: 404,
                message: 'user is not found'
            })
        }

        resolve(user);
    })
}
