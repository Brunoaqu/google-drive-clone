import 'dotenv/config';

import app from './app';

const PORT = process.env.PORT || 5000;

// Configuração do server
app.listen(PORT, () => console.log(`new Server listening at http://localhost:${PORT}`));
