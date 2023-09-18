import puppeteer from 'puppeteer';

// Function to open the website
async function openZameenWebsite() {
  // Launch a headless browser
  const browser = await puppeteer.launch();

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the Zameen website
  await page.goto('https://www.zameen.com');

  // You can perform additional actions on the page here if needed

  // Close the browser when done
  await browser.close();
}

// Call the function to open the website
openZameenWebsite();
