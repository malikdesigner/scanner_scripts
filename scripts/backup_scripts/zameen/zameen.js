import mysql from 'mysql';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
// Database connection configuration
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "intel_tool"
};

// Create a database connection
const connection = mysql.createConnection(dbConfig);
const directoryPath = './scripts/zameen/json/';
;
// Create the directory if it doesn't exist
if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
}
console.log(directoryPath)
// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        throw err;
    }
    console.log('Connected to the database');

    var city = process.argv.slice(2)[0];
    var propertyType = process.argv.slice(2)[1];

    // Initialize variables to store the values
    let propertyTypeName = '';
    let cityName = '';

    // Query the database to retrieve data from tbl_propertytype
    const queryType = `SELECT name FROM tbl_propertytype where id=${propertyType}`;

    connection.query(queryType, (err, resultsType) => {
        if (err) {
            console.error('Query error:', err);
            throw err;
        }

        // Check if resultsType is not empty and contains at least one row
        if (resultsType.length > 0) {
            propertyTypeName = resultsType[0].name; // Get the 'name' field from the first row
        }

        // Query the database to retrieve data from tbl_cities
        const queryCity = `SELECT city_name FROM tbl_cities where id=${city}`;

        connection.query(queryCity, (err, resultsCity) => {
            if (err) {
                console.error('Query error:', err);
                throw err;
            }

            // Check if resultsCity is not empty and contains at least one row
            if (resultsCity.length > 0) {
                cityName = resultsCity[0].city_name; // Get the 'city_name' field from the first row
            }

            // Close the database connection when done with both queries
            connection.end((err) => {
                if (err) {
                    console.error('Database connection closing error:', err);
                    throw err;
                }

                // Now you can use the values in 'propertyTypeName' and 'cityName'
                console.log('Database connection closed');
                // console.log('Property Type Name:'+ propertyTypeName);
                // console.log('City Name:'+ cityName);


                try {
                    // Use execSync to run the command synchronously
                    // const stdout = execSync(`node scripts/articleZameen.js ${jsonFilePath} > backend.txt`);
                    // console.log(jsonFilePath);
                    const stdout = execSync(`node ./scripts/articleZameen.js ${cityName} ${propertyTypeName} > backend.txt`);
                    // console.log(`node scripts/articleZameen.js "${jsonFilePath}"`)
                } catch (error) {
                    console.error(`Error: ${error.message}`);
                }

            });
        });
    });
});



//for creation and deletion of file
// const site_info = {
//     city_name: cityName,
//     propertyType: propertyTypeName
// }
// const jsonFileName = `${cityName}_${propertyTypeName}.json`;
// const jsonFilePath = directoryPath+jsonFileName;
// try {
//     fs.writeFileSync(jsonFilePath, JSON.stringify(site_info, null, 2));
//     console.log(`JSON file "${jsonFileName}" has been created successfully.`);
// } catch (error) {
//     console.error('Error writing JSON file:', error);
// }

// fs.unlink(jsonFilePath, (err) => {
//     if (err) {
//         console.error('Error deleting the file:', err);
//     } else {
//         console.log('File deleted successfully.');
//     }
// });