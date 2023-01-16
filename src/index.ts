import http from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os'
import * as dotenv from "dotenv";
import * as UserService from "./services/User.service.js";
import {IncomingMessage, ServerResponse} from "http";
import { validate } from 'uuid';
import {IUser} from "./Models/User";
import {getUserFromBody} from "./services/User.service.js";

interface IError {
    statusCode: number,
    message: string
}

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const hostname: string = '127.0.0.1';

const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.url?.startsWith('/api/users')) {
        switch (req.method) {
            case 'GET':
                try {
                    const id = req.url?.split('/')[3];
                    if (id) {
                        if (!validate(id)) {
                            res.statusCode = 400;
                            return res.end(JSON.stringify({
                                message: 'id is not valid'
                            }))
                        }
                        const result = await UserService.getUser(id);
                        res.statusCode = 200;
                        res.end(JSON.stringify(result));
                    } else {
                        res.statusCode = 200;
                        const users = await UserService.getUsers();
                        res.end(JSON.stringify(users));
                    }
                } catch (e) {
                    // @ts-ignore
                    res.statusCode = e.statusCode;
                    // @ts-ignore
                    res.end(e.message);
                }
                break;
            case 'POST':
                try {
                    const user: IUser = await getUserFromBody(req);
                    const result = await UserService.addUser(user);
                    res.statusCode = 201;
                    res.end(JSON.stringify(result))
                } catch (e) {
                    // @ts-ignore
                    res.statusCode = e.statusCode
                    // @ts-ignore
                    res.end(e.message)
                }
                break;
            case 'PUT':
                try {
                    const id = req.url?.split('/')[3];
                    if (id && validate(id)) {
                        const user = await getUserFromBody(req);
                        const result = await UserService.updateUser(id, user);
                        res.statusCode = 200;
                        res.end(JSON.stringify(result));
                    } else {
                        res.statusCode = 400;
                        res.end(JSON.stringify({
                            message: 'id is not valid'
                        }))
                    }
                } catch (e) {
                    // @ts-ignore
                    res.statusCode = e.statusCode;
                    // @ts-ignore
                    res.end(e.message);
                }
                break;
            case 'DELETE':
                try {
                    const id = req.url?.split('/')[3];
                    if (id && validate(id)) {
                        const result = await UserService.deleteUser(id);
                        res.statusCode = 204;
                        res.end(JSON.stringify(result));
                    } else {
                        res.statusCode = 400;
                        res.end(JSON.stringify({
                            message: 'id is not valid'
                        }))
                    }
                } catch (e) {
                    // @ts-ignore
                    res.statusCode = e.statusCode;
                    // @ts-ignore
                    res.end(e.message);
                }
                break;
            default:
                res.statusCode = 404;
                res.end('This route is not found');
        }
    }
}

const server = http.createServer(requestListener);

server.listen(PORT, hostname, () => {
    console.log(`Server running at http://${hostname}:${PORT}/`);
});

// if (cluster.isPrimary) {
//     console.log(os.cpus().length)
//     for (let i = 1; i < os.cpus().length - 1; i++) {
//         const server = http.createServer(requestListener);
//
//         server.listen(PORT + i, hostname, () => {
//             console.log(`Server running at http://${hostname}:${PORT + i}/`);
//         });
//         const worker = cluster.fork();
//         worker.on('listening', (address) => {
//             console.log('addrres', address)
//         });
//     }
// }

server.on('error', function (req: IncomingMessage, res: ServerResponse) {
    res.statusCode = 500;
    res.end('Server not responding');
})
