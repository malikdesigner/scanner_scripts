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
const dataFilePath = 'C:\\Local_Projects\\scanner_scripts\\scripts\\zameen\\2236400.txt';

// Read the JSON data from the text file
const jsonData = fs.readFileSync(dataFilePath, 'utf8');

// Parse the JSON data into a JavaScript object
const record = JSON.parse(jsonData);
function toggleSingularPlural(word) {
  const pluralForm = pluralize(word, 2); // Convert to plural
  const singularForm = pluralize(word, 1); // Convert to singular

  // If the input word is in singular form, return its plural form; otherwise, return its singular form
  return word === singularForm ? pluralForm : singularForm;
}


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
// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Get the id from tbl_propertycategory based on the Type
const propertyCategoryName = toggleSingularPlural(record.Type);
console.log(propertyCategoryName)
record.images = JSON.stringify(record.images);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  // Check if a record with the same title already exists in the database
  connection.query('SELECT * FROM tbltransactions WHERE title = ?', [record.title], (selectErr, results) => {
    if (selectErr) {
      console.error('Error querying the tbltransactions table:', selectErr);
      connection.release();
      return;
    }

    // if (results.length > 0) {
    //   console.log('Record with the same title already exists. Skipping insertion.');
    //   connection.release();
    //   return;
    // }

    // Query the database to get the id based on Type from tbl_propertycategory
    const sqlQuery = `SELECT id FROM tbl_propertycategory WHERE name = '${propertyCategoryName}' OR name = '${record.Type}'`;

    connection.query(
      sqlQuery, // Check both singular and original form
      (categoryErr, categoryResults) => {
        if (categoryErr) {
          console.error('Error querying the tbl_propertycategory table:', categoryErr);
          connection.release();
          return;
        }

        if (categoryResults.length > 0) {
          // Assign the id from the database to the record's 'Type' field
          delete record.Type;
          record.type = categoryResults[0].id;

          // Insert the record into the tbltransactions table
          connection.query('INSERT INTO tbltransactions SET ?', record, (insertErr) => {
            if (insertErr) {
              console.error('Error inserting record:', insertErr);
            } else {
              console.log('Record inserted successfully.');
            }

            connection.release();
          });
        } else {
          console.error(`Property category '${propertyCategoryName}' not found in the database.`);
          connection.release();
        }
      });
  });
});
