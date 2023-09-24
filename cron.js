

// TO RUN THIS SERVER RUN THIS COMMAND
//npm run start:cron

import http from 'http';
import cron from 'node-cron';
import { execSync } from 'child_process';

const hostname = '127.0.0.1';
const port = 3001;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.end('Hello world');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
// articles from zameen.com
    cron.schedule('* * * * * *', () => {
        try {
            // Use execSync to run the command synchronously
            // const stdout = execSync('node scripts/articleZameen.js > backend.txt');
            const stdout = execSync('node scripts/zameen.js ');
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
    cron.schedule('* * * * * *', () => {
        try {
            // Use execSync to run the command synchronously
            const stdout = execSync('node scripts/articleGranna.js > granna.txt');
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
});
