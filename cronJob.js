import http from 'http';
import cron from 'node-cron';
import { execSync } from 'child_process';

const hostname = '127.0.0.1';
const port = 3002;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/plain');
    res.end('Hello world');
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);

    // articles from zameen.com
    cron.schedule('0 */30 * * * *', () => {
        // Run every 30 minutes
        try {
            const stdout_ISB = execSync('node scripts/articleZameen.js 10 10 0 > zameen_log_ISB.txt');
            const stdout_Kar = execSync('node scripts/articleZameen.js 1 10 0 > zameen_log_Kar.txt');
            const stdout_LAH = execSync('node scripts/articleZameen.js 2 10 0 > zameen_log_LAH.txt');
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });

    cron.schedule('0,30 * * * *', () => {
        // Run every 30 minutes, on the hour and half-hour
        try {
            // Run Zameen Insertion
            const stdout = execSync('php scripts/zameenInsertion.php');
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    });
});
