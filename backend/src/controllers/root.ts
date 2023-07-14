import express from 'express';


// export const getRootHandler = express.Router();
// console.log('Conroler Root - ROUTS')

// getRootHandler.use('/', getRootHandler);


export type Admin = {
    id: number;
    email: String;
    firstName: string;
    lastName: string;
    role: number;
};


export const getRootHandler = async (): Promise<Admin[]> => {
    const res = [{
        id: 1,
        email: 'email@email.com',
        firstName: 'Djon',
        lastName: 'Dap',
        role: 1,
    }];

    console.log('Conroler Root - ROUTS')

    return res

};

// const getRootHandler = (req, res) => {
//     res.send('Get root route');
// };

// module.exports = { getRootHandler };

// export default getRootHandler;
