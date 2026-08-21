import express from 'express';
import { authRouter } from './routes/auth.js';
import { propertiesRouter } from './routes/properties.js';
import { tenantsRouter } from './routes/tenants.js';
import { unitsRouter } from './routes/unit.js';
import { leasesRouter } from './routes/leases.js';
import { paymentsRouter } from './routes/payments.js';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/properties', propertiesRouter);

app.use('/api/tenants', tenantsRouter);

app.use('/api/units', unitsRouter);

app.use('/api/leases', leasesRouter);

app.use('/api/payments', paymentsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

