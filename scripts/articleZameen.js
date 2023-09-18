//const puppeteer = require('puppeteer');
const puppeteer = require("puppeteer-extra");
//const jsonfile = require('jsonfile');
var filesystem = require('fs');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
var args = process.argv.slice(2)[0];
var siteInfo = JSON.parse(filesystem.readFileSync(args, 'utf8'));
var platform_id = siteInfo.PLATFORM_ID;
const profilePath = "";
const profileID = "";
const role_id = siteInfo.ROLE_ID;
var keyword = siteInfo.keyword;
var keyword_id = siteInfo.keyword_id

// const role_id = 3;
// var keyword = "mobile games";
// var keyword_id=3;
// var platform_id = 1811
var showOnConsole = true;
// var proxy = '--proxy-server=' + siteInfo.PROXY || '';
var showOnConsole = true;

keyword = keyword.replace(" ", "+");

var url = 'https://www.youtube.com/results?search_query=' + keyword + '&sp=EgIIAg%253D%253D';
//var cookiesPath ="/opt/vp2/facebook/facebook_cookie/test1.txt";
var path = "/opt/vp2/export-data/";
var save_path = "/opt/vp2/youtube/ad_results_wifi/";
// var path = "E:/Mcp_Insights/LocalProjectskeyscommands/Locally_Projects/youtube/opt/vp2/export-data/";
// var save_path = "E:/Mcp_Insights/LocalProjectskeyscommands/Locally_Projects/youtube/opt/vp2/ad_results_wifi/";
var currentUID = getUID();
var cur_date = new Date();
var date_directory = cur_date.getFullYear() + '-' + (cur_date.getMonth() + 1) + '-' + cur_date.getDate();
const date = new Date(),
    imgPath = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + "/" + date.getHours() + "/",
    dateDir = path + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

path = path + imgPath;
!filesystem.existsSync(dateDir) && filesystem.mkdirSync(dateDir);
!filesystem.existsSync(path) && filesystem.mkdirSync(path);

console.log("platform id =" + platform_id);
console.log("role_id =" + role_id);
console.log("profilePath =" + profilePath);
console.log("profileID =" + profileID);
console.log("keyword =" + keyword);

(async () => {

    try {
        console.log('Step 1 - Opening Ad URL', 1);

        //puppeteer.use(pluginStealth());

        const browser = await puppeteer.launch({
            'args': ['--disable-web-security', '--allow-http-screen-capture', '--allow-running-insecure-content', '--disable-features=site-per-process', '--no-sandbox'],
            ignoreHTTPSErrors: true,
            'headless': true,
            timeout: 10000,
            userDataDir: profilePath,
            slowMo: 250, // slow down by 250ms
            devtools: false,
            //executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome",

        });

        const page = await browser.newPage();
        //page.on('console', msg => console.log('PAGE LOG:', msg.text));

        /*page.on('console', msg => {
            for (let i = 0; i < msg._args.length; ++i)
                console.log(`${i}: ${msg._args[i]}`);
            });*/

        //page.setCookie();
        //let { cookies } = await page._client.send('Network.getAllCookies');

        //await page._client.send('Network.clearBrowserCookies');
        //await page.setRequestInterceptionEnabled(true);
        //await page.setRequestInterception(true);
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

        //var articles = await page.$$("[role='article']" );
        await page.evaluate(() => {
            try {
                document.querySelector('[aria-label^="Accept the use of cookies"]').click();
            } catch (error) { }

        });
        console.log("Waiting 30 seconds");
        await delay(3000);
        var videos = await page.$$('#contents.ytd-item-section-renderer ytd-video-renderer ytd-thumbnail');
    }
    catch (e) {
        console.log('FAIL to load the address', 1);

        console.log(e);

        process.exit(1);
    }




})();

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
    return platform_id + "_" + Date.now();
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
