export interface IUser
{
    id?: string,
    username: string;
    age: number;
    hobbies: string[];
}

export interface IHobbies {
    hobbies: string[] | [];
}

// export interface Item extends BaseItem {
//     id: number;
// }
