import express from 'express';
import cors from 'cors';
import { routes } from './routes/File.Route';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/src/public`));
app.use('/', routes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));

export { app };
