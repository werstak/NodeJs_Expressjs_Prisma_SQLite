import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { router } from './routes'


dotenv.config();

// const {PORT} = process.env
const PORT = 5000;

const app = express();

app.use(express.json());
app.use(cors());
app.use('/src/uploads/', express.static('src/uploads/'));


app.use(router);

app.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
