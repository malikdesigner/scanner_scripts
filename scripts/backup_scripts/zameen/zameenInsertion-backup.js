import fs from 'fs';
import mysql from 'mysql';
import pluralize from 'pluralize';
// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'intel_tool',
};

// Data file path
const dataFilePath = 'C:\\Local_Projects\\scanner_scripts\\scripts\\zameen\\1640213.txt';

// Read the JSON data from the text file
const jsonData = fs.readFileSync(dataFilePath, 'utf8');

// Parse the JSON data into a JavaScript object
const record = JSON.parse(jsonData);
record.Bath = record['Bath(s)'];
delete record['Bath(s)'];

record.Bedroom = record['Bedroom(s)'];
delete record['Bedroom(s)'];

if (record['Price']) {
    console.log(record['Price'])
    console.log(record['price'])

    delete record['price'];
}
console.log(record)
// Serialize the images array to a JSON string
record.images = JSON.stringify(record.images);
const propertyCategoryName = record.Type;
// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Insert the record into the MySQL database
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }

    // Check if a record with the same title already exists in the database

    connection.query('SELECT * FROM tbltransactions WHERE title = ?', [record.title], (selectErr, results) => {
        if (selectErr) {
            console.error('Error querying the database:', selectErr);
            connection.release();
            return;
        }
        connection.query('SELECT id FROM tbl_propertycategory WHERE name = ?', [propertyCategoryName], (selectErr, results) => {
            if (selectErr) {
                console.error('Error querying the database:', selectErr);
                connection.release();
                return;
            }
            console
            if (results.length > 0) {
                // Assign the id from the database to the record's 'Type' field
                delete record.Type;
                record.type = results[0].id;
            }

            if (results.length === 0) {
                // Insert the record into the tbltransactions table if it doesn't exist
                connection.query('INSERT INTO tbltransactions SET ?', record, (insertErr) => {
                    if (insertErr) {
                        console.error('Error inserting record:', insertErr);
                    } else {
                        console.log('Record inserted successfully.');
                    }

                    connection.release();
                });
            } else {
                console.log('Record with the same title already exists. Skipping insertion.');
                connection.release();
            }
        });
    });
});
