import express from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';

const app = express();
const port = config.port;

app.use(cors());
app.use(express.json());

app.use(routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
