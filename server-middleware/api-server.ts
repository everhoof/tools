import bodyParser from 'body-parser';
import express from 'express';
import * as preview from '../api/preview';

const app = express();

app.use(bodyParser.json());
app.post('/preview/generate', preview.generate);

export default app;
