const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres:Khush%4085@localhost:5432/postgres',
});

client.connect()
    .then(() => {
        console.log('Connected successfully');
        return client.end();
    })
    .catch(err => {
        console.error('Connection error', err.stack);
        client.end();
    });
