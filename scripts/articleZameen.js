//const puppeteer = require('puppeteer');
import mysql from 'mysql';
import filesystem from 'fs';
import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import { subDays, subHours, subMinutes, subWeeks, format } from 'date-fns';

// Database connection configuration
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "intel_tool"
};

// Create a function to query the database for property type name
const getPropertyTypeName = (connection, propertyType) => {
    return new Promise((resolve, reject) => {
        const queryType = `SELECT name FROM tbl_propertytype WHERE id=${propertyType}`;
        connection.query(queryType, (err, resultsType) => {
            if (err) {
                reject(err);
            } else {
                const propertyTypeName = resultsType.length > 0 ? resultsType[0].name : '';
                resolve(propertyTypeName);
            }
        });
    });
};

// Create a function to query the database for city name
const getCityName = (connection, city) => {
    return new Promise((resolve, reject) => {
        const queryCity = `SELECT city_name FROM tbl_cities WHERE id=${city}`;
        connection.query(queryCity, (err, resultsCity) => {
            if (err) {
                reject(err);
            } else {
                const cityName = resultsCity.length > 0 ? resultsCity[0].city_name : '';
                resolve(cityName);
            }
        });
    });
};
function isValidPhoneNumber(text) {
    const phonePattern = /^\+\d{2}-\d{10}$/;
    if (!phonePattern.test(text)) {
      return false; 
    }
    const numericText = text.replace(/[^0-9]/g, '');
    const phoneNumber = parseInt(numericText);
  
    // Check if the parsing was successful and return the result
    return !isNaN(phoneNumber);
  }
  function convertRelativeTimeToDate(relativeTime) {
    const now = new Date();
  
    if (relativeTime.endsWith('ago')) {
      const timeValue = parseInt(relativeTime, 10);
      if (relativeTime.includes('day')) {
        return format(subDays(now, timeValue), 'yyyy-MM-dd HH:mm:ss');
      } else if (relativeTime.includes('hour')) {
        return format(subHours(now, timeValue), 'yyyy-MM-dd HH:mm:ss');
      } else if (relativeTime.includes('minute')) {
        return format(subMinutes(now, timeValue), 'yyyy-MM-dd HH:mm:ss');
      } else if (relativeTime.includes('week')) {
        return format(subWeeks(now, timeValue), 'yyyy-MM-dd HH:mm:ss');
      }
    }
  
    return null; // Invalid input or no 'ago' suffix found
  }
// Main function to execute the code and return values
const city = process.argv.slice(2)[0];
const propertyType = process.argv.slice(2)[1];
var amenities = city + propertyType + '.png';
const main = async () => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();



    try {
        // Use Promise.all to fetch propertyTypeName and cityName concurrently
        const [propertyTypeName, cityName] = await Promise.all([
            getPropertyTypeName(connection, propertyType),
            getCityName(connection, city)
        ]);

        // Close the database connection
        connection.end();

        // Return an object containing the values
        return { cityName, propertyTypeName };
    } catch (err) {
        console.error('Error:', err);
        connection.end(); // Ensure the database connection is closed in case of an error
        throw err; // Re-throw the error for handling in the calling code
    }
};
var cityName = '';
var propertyTypeName = '';


// Call the main function to start execution
await main(city, propertyType)
    .then((result) => {
        console.log('Result:', result);

        cityName = result.cityName;
        propertyTypeName = result.propertyTypeName;
        //const jsonfile = require('jsonfile');

        var current_path = process.cwd();
        console.log(current_path)
        //  var args = process.argv.slice(2)[0];
        //  var siteInfo = JSON.parse(filesystem.readFileSync(args, 'utf8'));

        console.log("********")
        console.log("CITYNAME" + cityName)
        console.log("PROPERTY TYPE NAME" + propertyTypeName)


        var showOnConsole = true;
        var showOnConsole = true;


        var path = current_path + "/scripts/export-data/";
        var save_path = current_path + "/scripts/zameen/";

        var currentUID = getUID();
        var cur_date = new Date();
        var date_directory = cur_date.getFullYear() + '-' + (cur_date.getMonth() + 1) + '-' + cur_date.getDate();
        const date = new Date(),
            imgPath = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + "/" + date.getHours() + date.getMinutes() + date.getSeconds() + "/",
            dateDir = path + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

        path = path + imgPath;
        console.log(dateDir);
        console.log(path)
        !filesystem.existsSync(dateDir) && filesystem.mkdirSync(dateDir);
        !filesystem.existsSync(path) && filesystem.mkdirSync(path);
        var count = 0;
        var url = "https://www.zameen.com/";
        (async () => {

            try {
                console.log('Step 1 - Opening Ad URL', 1);

                //puppeteer.use(pluginStealth());

                const browser = await puppeteer.launch({
                    'args': ['--disable-web-security', '--allow-http-screen-capture', '--allow-running-insecure-content', '--disable-features=site-per-process', '--no-sandbox'],
                    ignoreHTTPSErrors: true,
                    'headless': false,
                    timeout: 10000,
                    slowMo: 250, // slow down by 250ms
                    devtools: false,
                    //  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome",

                });

                const page = await browser.newPage();

                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36');
                await page.setViewport({ width: 1360, height: 700 });

                console.log("Opening url =" + url);
                await page.goto(url, {
                    waitUntil: 'networkidle2',
                    timeout: 100000000
                });
                //await page.screenshot({path: '/opt/fb_puppeteer/scanning.png'});
                console.log("current url is " + page.url());

                await delay(3000);
                //return true;

                console.log('Using size:' + JSON.stringify(page.viewport()), 1);
                try {
                    // Use page.evaluate to click the button with a specific aria-label
                    await page.evaluate(() => {
                        const buttons = document.querySelectorAll('[aria-label="City filter"]');
                        if (buttons.length > 0) {
                            buttons[0].click();
                        } else {
                            console.error(`Button city filter not found.`);
                        }
                    });
                } catch (e) {
                    console.error(e);
                }
                delay(3000)
                try {
                    // Use page.evaluate to click the button with a specific aria-label
                    await page.evaluate((cityName) => {
                        const buttons = document.querySelectorAll(`[name="City"] button[aria-label="${cityName}"]`);
                        if (buttons.length > 0) {
                            buttons[0].click();
                        } else {
                            console.error(`Button with aria-label "${cityName}" not found.`);
                        }
                    }, cityName);
                } catch (e) {
                    console.error(e);
                }

                await delay(3000);
                try {
                    // Use page.evaluate to click the button with a specific aria-label
                    await page.evaluate(() => {
                        const buttons = document.querySelectorAll('[aria-label="Collapse expand button"]');
                        if (buttons.length > 0) {
                            buttons[0].click();
                        } else {
                            console.error(`Button city filter not found.`);
                        }
                    });
                } catch (e) {
                    console.error(e);
                }
                await delay(3000);
                try {
                    // Use page.evaluate to click the button with a specific aria-label
                    await page.evaluate(() => {
                        const buttons = document.querySelectorAll('[name="property type"]');
                        if (buttons.length > 0) {
                            buttons[0].click();
                        } else {
                            console.error(`Button city filter not found.`);
                        }
                    });
                } catch (e) {
                    console.error(e);
                }
                await delay(3000);
                console.log(propertyTypeName);
                try {
                    await page.evaluate((propertyTypeName) => {
                        // Use page.evaluate to click the button with a specific aria-label
                        const categoryPicker = document.querySelector('ul[name="Category picker"]');

                        if (propertyTypeName == "Home") {
                            const btn = categoryPicker.querySelector('li:nth-child(1)');
                            if (btn) {
                                btn.click();
                            }
                        } else if (propertyTypeName == "Plots") {
                            const btn = categoryPicker.querySelector('li:nth-child(2)');
                            if (btn) {
                                btn.click();
                            }
                        } else if (propertyTypeName == "Commercial") {
                            const btn = categoryPicker.querySelector('li:nth-child(3)');
                            if (btn) {
                                btn.click();
                            }
                        }
                    }, propertyTypeName);
                } catch (e) {
                    console.error(e);
                }

                await delay(3000);
                try {
                    // Use page.evaluate to click the button with a specific aria-label
                    await page.evaluate(() => {
                        const buttons = document.querySelectorAll('[aria-label="Collapse expand button"]');
                        if (buttons.length > 0) {
                            buttons[0].click();
                        } else {
                            console.error(`Button city filter not found.`);
                        }
                    });
                } catch (e) {
                    console.error(e);
                }

                await delay(3000);

                console.log("Waiting 30 seconds");
                try {
                    await page.evaluate(() => {
                        // Use page.evaluate to click the element with the specified selector
                        const findButton = document.querySelector('a[aria-label="Find button"]');
                        if (findButton) {
                            findButton.click();
                        }
                    });
                } catch (e) {
                    console.error(e);
                }
                await delay(10000);
                console.log("Waiting 10 seconds");

                const allHrefs = [];
                console.log("Applying filter")
                await page.evaluate(() => {

                    var btn = document.querySelectorAll('[aria-label="Sort by filter"]')[0];
                    if (btn) {
                        btn.click();
                    }
                    var btn = document.querySelectorAll('[role="listbox"] ul li')[1];
                    if (btn) {
                        btn.click();
                    }
                })
                while (true) {
                    await delay(3000);
                    //getting property links
                    const hrefs = await page.$$eval('ul li[role="article"][aria-label="Listing"] article a[aria-label="Listing link"]', (anchors) => {
                        return anchors.map((anchor) => anchor.getAttribute('href'));
                    });

                    if (hrefs.length === 0) {
                        break;
                    }

                    allHrefs.push(...hrefs);
                    for (const href of allHrefs) {
                        console.log(href)
                        await page.goto("https://www.zameen.com/" + href, {
                            waitUntil: 'networkidle2',
                            timeout: 100000000
                        });
                        delay(3000)

                        //getting property details 
                        const details = await page.evaluate(() => {
                            const data = {};
                            const items = Array.from(document.querySelectorAll('ul[aria-label="Property details"] li'));

                            for (let i = 0; i < items.length; i++) {
                                const heading = items[i].querySelector('span:first-child').textContent.trim();
                                const value = items[i].querySelector('span:last-child').textContent.trim();
                                data[heading] = value;
                            }

                            return data;
                        });
                        var timeOfAd=convertRelativeTimeToDate(details['Added']);
                        if(timeOfAd){
                            details['Added']=timeOfAd;
                        }
                        delay(2000)
                        const boundingBox = await page.evaluate(() => {
                            const btn = document.querySelector('#body-wrapper > main > div.b13950ad > div._082ea4a5 > div:nth-child(5) > div:nth-child(1) > div > div:nth-child(4) > div._2f838ff4');
                            if (btn) {
                                btn.click();
                            }

                            //const divElement = document.querySelector('main div:nth-child(4) div div:nth-child(5) div div div:nth-child(4)');
                            const divElement = document.querySelectorAll('div._208d68ae.c352c124._1aca585a div._066bb126')[2];
                            const divAmenities = document.querySelectorAll('div._208d68ae.c352c124._1aca585a div._066bb126 h3')[2];

                            if (divElement && divAmenities.textContent == 'Amenities') {
                                const { x, y, width, height } = divElement.getBoundingClientRect();
                                return { x, y, width, height };
                            }
                            return null;
                        });

                        if (boundingBox) {

                            await page.screenshot({
                                path: path + amenities,
                                clip: boundingBox, // Use the bounding box to clip the screenshot
                            });
                            details['amenities'] = path + amenities;
                            console.log('Screenshot saved as ' + path + amenities);
                        } else {
                            console.log("Amenities not found")
                        }
                        delay(4000)
                        // getting property desceription
                        // page.waitForSelector('[aria-label="Property description"]');
                        var propertyDesc = await page.evaluate(() => {

                            var propertyDescription = document.querySelector('[aria-label="Property description"]');
                            var propertyDesc = propertyDescription.textContent;
                            return propertyDesc;
                        })

                        details['description'] = propertyDesc;
                        details['mainLink'] = "https://www.zameen.com/" + href;




                        //   Getting whatsapp link
                        const newPagePromise = new Promise(resolve => {
                            browser.once('targetcreated', target => resolve(target.page()));
                        });
                        var ph = await page.evaluate(() => {
                            // Click the button
                            var pnum = document.querySelectorAll('button[aria-label="Whatsapp"]')[0];
                            if (pnum) {
                                pnum.click();
                            }
                        })
                        // Wait for some time to allow WhatsApp to load
                        delay(5000)
                        const newPage = await newPagePromise;

                        // Handle the alert if it appears
                        page.on('dialog', async (dialog) => {
                            console.log('Alert message:', dialog.message());
                            await dialog.dismiss();
                        });

                        // Wait for some time again to allow the alert to be dismissed and the page to fully load
                        delay(2000)
                        if (newPage && (await newPage.target().type() === 'page')) {
                            details['whatsapp'] = newPage.url();
                            console.log('WhatsApp URL:', details['whatsapp']);
                        } else {
                            console.error('New page not created or not a popup.');
                        }
                        // Switch back to the original tab
                        await page.bringToFront();
                        // console.log(details);
                        delay(5000)
                        const camera = await page.$('[aria-label="View gallery"]');
                        if (camera) {
                            await camera.click();
                        }
                        else {
                            const proImage = await page.$('div.b7bf9694[aria-label="Property image"]');
                            if (proImage) {

                                await proImage.click()
                            }
                            else {
                                break;
                            }
                        }

                        delay(2000)
                        var ph = await page.evaluate(() => {

                            var pnum = document.querySelectorAll('form button[aria-label="Call"]')[1];
                            if (pnum) {

                                var phoneNumber = pnum.textContent;
                                pnum.click();
                            }

                        })
                        delay(1000)
                        if(!isValidPhoneNumber(phoneNumber)){

                            var phoneNumber = await page.evaluate(() => {
                                var pnums = document.querySelectorAll('form button[aria-label="Call"]')[1];
                                var phoneNumber = pnums.textContent;
                               
                                return phoneNumber;
                            })
                        }
                        if(!isValidPhoneNumber(phoneNumber)){

                            var phoneNumber = await page.evaluate(() => {
                                var pnums = document.querySelectorAll('form button[aria-label="Call"]')[1];
                                var phoneNumber = pnums.textContent;
                               
                                return phoneNumber;
                            })
                        }
                        console.log(phoneNumber);
                        details['phoneNumber'] = phoneNumber;
                        var title = await page.evaluate(() => {
                            var pnums = document.querySelector('h1');
                            var title = pnums.textContent;
                            return title;
                        })
                        console.log(title);
                        details['title'] = title;
                        var subHeading = await page.evaluate(() => {
                            var pnums = document.querySelector('[aria-label="Property header"]');
                            var subHeading = pnums.textContent;
                            return subHeading;
                        })
                        details['subHeading'] = subHeading;
                        var currency = await page.evaluate(() => {
                            var pnums = document.querySelector('[aria-label="Currency"]');
                            var currency = pnums.textContent;
                            return currency;
                        })

                        var Price = await page.evaluate(() => {
                            var pnums = document.querySelector('[aria-label="Price"]');
                            var Price = pnums.textContent;
                            return Price;
                        })
                        var propertyPrice = Price + ' ' + currency;
                        details['price'] = propertyPrice;
                        const elements = await page.$('[aria-label="Gallery Dialog"] div div div div div');
                        try {

                            var photos = await elements.evaluate(element => element.textContent);
                            console.log(photos);
                        } catch (e) { }

                        // const regex = /\((\d+)\)/; // Regular expression to match the number within parentheses
                        if (photos) {

                            let matches = photos.match(/(\d+)/);

                            // Display output if number extracted
                            if (matches) {
                                console.log(matches[0]);
                                var numberOfPhotos = matches[0];
                            }
                            else {
                                numberOfPhotos = 10;
                            }


                            for (var i = 0; i < numberOfPhotos; i++) {

                                delay(2000);
                                const rightArrowss = await page.$('.showThumbnails .image-gallery .image-gallery-slide-wrapper.bottom div[aria-label="Right arrow"]');
                                if (rightArrowss) {
                                    await rightArrowss.click();
                                } else {
                                    console.error('Photo arrow not found');
                                    break;
                                }
                            }

                            delay(500);
                            const images = await page.$$eval('.image-gallery-slide picture source', (anchors) => {
                                return anchors.map((anchor) => anchor.getAttribute('srcset'));
                            });
                            details['images'] = images;
                            console.log(images);
                        }
                        var hours = cur_date.getHours().toString();
                        var minutes = cur_date.getMinutes().toString();
                        var seconds = cur_date.getSeconds().toString();
                        console.log(details);
                        if (details) {
                            console.log(' File is saved ' + save_path + hours + minutes + seconds + count + '.txt')
                            write2File(save_path + hours + minutes + seconds + count + '.txt', JSON.stringify(details), "overwrite");
                        }
                        count++;


                    }

                    const next = await page.$('div[role="navigation"] ul li a[title="Next"]');
                    if (!next) {
                        break;
                    }
                    console.log('Moving to next page')
                    await next.click();
                }
            }
            catch (e) {
                console.log('FAIL to load the address', 1);

                console.log(e);

                process.exit(1);
            }




        })();
    })
    .catch((error) => {
        console.error('Error:', error);
    });

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

function logIt(msg, exclude_from_log) {
    if (typeof (exclude_from_log) == "undefined") {
        exclude_from_log = 0;
    }

    if (showOnConsole) {
        console.log(msg);
    }


}

function getUID(length) {
    length = length || 12;
    return cityName + "_" + Date.now();
}

function write2File(filename, contents, mode) {
    if (typeof (mode) == "undefined") {
        mode = 'overwrite';
    } else {
        mode = 'append';
    }
    try {
        if (mode == "append") {
            filesystem.appendFile(filename, contents, (err) => {
                if (err) throw err;
            });
        } else {
            filesystem.writeFile(filename, contents, (err) => {
                if (err) throw err;
            });
        }
    } catch (e) {
        logIt(e);
    }
}
// function isValidPhoneNumber(text) {
//     const phonePattern = /^\+\d{2}-\d{10}$/;
//     if (!phonePattern.test(text)) {
//       return false; 
//     }
//     const numericText = text.replace(/[^0-9]/g, '');
//     const phoneNumber = parseInt(numericText);
  
//     // Check if the parsing was successful and return the result
//     return !isNaN(phoneNumber);
//   }

