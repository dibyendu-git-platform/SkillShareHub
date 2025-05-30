import 'dotenv/config';
import connectDB from './db/index.js';
import { app } from './app.js';

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});