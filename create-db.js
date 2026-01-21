const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:Khush%4085@localhost:5432/postgres',
});

async function createDb() {
    try {
        await client.connect();
        // Check if exists first to avoid error
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = 'Food_influencer'`);
        if (res.rowCount === 0) {
            await client.query('CREATE DATABASE "Food_influencer"');
            console.log('Database created');
        } else {
            console.log('Database already exists');
        }
    } catch (err) {
        console.error('Error creating DB', err);
    } finally {
        await client.end();
    }
}

createDb();
