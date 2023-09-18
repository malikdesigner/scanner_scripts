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
const role_id =siteInfo.ROLE_ID;
var keyword=siteInfo.keyword;
var keyword_id=siteInfo.keyword_id

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
    console.log("Total Videos =" + videos.length);
    var i = 0;
    if (videos.length > 0) {
      for (var d = 0; d < videos.length; d++) {
        var ads_found = 0;
        try {
          await videos[d].click();

          await delay(10000)
          await page.keyboard.press('Space');
          await delay(2000)

          //main bigger banner
          try {
            await page.waitForSelector('ytd-player-legacy-desktop-watch-ads-renderer', { timeout: 5000 });
          } catch (e) {

          }
          var articles = await page.$$('ytd-player-legacy-desktop-watch-ads-renderer')
          var articlesLength = await page.$$('ytd-player-legacy-desktop-watch-ads-renderer button')
          console.log('Main bigger banner articles ' + articlesLength.length);
          //small above the videos with button
          try {
            await page.waitForSelector('ytd-in-feed-ad-layout-renderer', { timeout: 5000 });
          } catch (e) {

          }
          var nextButton = await page.$$('#sparkles-container')
          var nextButtonLength = await page.$$('ytd-in-feed-ad-layout-renderer button')
          console.log('Articles small above the videos with button' + nextButtonLength.length);
          //small above the videos without button
          try {
            await page.waitForSelector('ytd-ad-slot-renderer ytd-in-feed-ad-layout-renderer', { timeout: 5000 });
          } catch (e) {

          }
          //  var anchorTag = await page.$$('ytd-ad-slot-renderer ytd-in-feed-ad-layout-renderer')
          var anchorTag = await page.$$('ytd-ad-slot-renderer ytd-in-feed-ad-layout-renderer ytd-compact-promoted-video-renderer')

          //var anchorTagLength = await page.$$('ytd-ad-slot-renderer ytd-in-feed-ad-layout-renderer a');
          var anchorTagLength = await page.$$('ytd-ad-slot-renderer ytd-in-feed-ad-layout-renderer ytd-compact-promoted-video-renderer #thumbnail')

          console.log("Articles small above the videos without button" + anchorTagLength.length)
          //for (var j = 0; j < article.length; j++) {

          // }
          try {
            var extraBtn = await page.$("#main button");
            await extraBtn.click()

          }
          catch (e) { }


        }
        catch (e) { }

        //}
        // var ads_elem  = await articles[i].$$( '.style-scope.ytd-badge-supported-renderer');
        if (articlesLength.length > 0) {
          console.log("First Ad found");
          i++;
          //break;

          // ############### evaluate function for body distance #######
          const adRect = await page.evaluate((articles) => {
            function getCoords(elem) { // crossbrowser version
              var box = elem.getBoundingClientRect();

              var body = document.body;
              var docEl = document.documentElement;

              var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
              var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

              var clientTop = docEl.clientTop || body.clientTop || 0;
              var clientLeft = docEl.clientLeft || body.clientLeft || 0;

              var top = box.top + scrollTop - clientTop;
              var left = box.left + scrollLeft - clientLeft;

              return { top: Math.round(top) };
            }

            var offset_func = getCoords(articles);

            const {
              x,
              y,
              width,
              right,
              height
            } = articles.getBoundingClientRect();
            return {
              x,
              y,
              width,
              right,
              height, top_offset: offset_func.top
            };

          }, articles[0].asElement());
          console.log("width:" + adRect.width);
          console.log("height:" + adRect.height);
          console.log("top_offset:" + adRect.top_offset);

          // ######## scrolling into view ############
          await page.evaluate((element) => {
            element.scrollIntoView();
          }, articles[0].asElement());
          // ######## scrolling into view ############
          await delay(2000);
          // adding border
          await page.evaluate((element) => {
            element.style.border = '5px solid red';
          }, articles[0].asElement());

          await delay(2000);

          const adImg = currentUID + '-ad-desktop-side-' + i + '.jpeg';
          const adImgView = currentUID + '-ad-view-desktop-side-' + i + '.jpeg';

          console.log("Waiting for 5 seconds");
          await page.evaluate(() => {
            window.scrollTo(0, 0);
          })
          await delay(5000);
          console.log("Waiting for 5 seconds finished");
          console.log("taking screen shot");

          await page.screenshot({
            path: path + adImg,
            clip: {
              x: adRect.x - 5, //x1
              y: adRect.top_offset - 75, //y1
              width: adRect.width + 10, //x2
              height: adRect.height + 100 //y2
            }
          });
          console.log("taking view shot");
          console.log(path + adImg)
          await page.screenshot({
            path: path + adImgView,
            clip: {
              x: adRect.x - 5, //x1
              y: adRect.top_offset - 75, //y1
              width: adRect.width + 10, //x2
              height: adRect.height + 500 //y2
            }
          });
          console.log(path + adImgView)

          // removing border
          await page.evaluate((element) => {
            element.style.border = 'none';
          }, articles[0].asElement());
          try {

            // var button = await page.$$('ytd-player-legacy-desktop-watch-ads-renderer button')
            var button = await page.$("ytd-action-companion-ad-renderer.style-scope.ytd-companion-slot-renderer");
            const atag_href = await page.evaluate(() => {
              const button = document.querySelector('ytd-action-companion-ad-renderer.style-scope.ytd-companion-slot-renderer');

              if (button) {
                const dataHost = button.__data;

                const navigationEndpoint = dataHost.data.navigationEndpoint;
                if (navigationEndpoint && navigationEndpoint.urlEndpoint) {
                  return navigationEndpoint.urlEndpoint.url;
                }

              }

              return null;
            });



            console.log("atag_href = " + atag_href);
            if (atag_href != null) {

              var iter_data = { platform_id: platform_id, keyword: keyword, keyword_id: keyword_id, role_id: role_id, href: atag_href, image_name: path + adImg, home_image_name: path + adImgView, home_url: url, };
              write2File(save_path + adImg.replace(".jpeg", ".txt"), JSON.stringify(iter_data), "overwrite");
            }
            await delay(2000);
          } catch (e) { console.log(e) }
          //	return true;
          //break;
          console.log("GO")
        }
        if (nextButtonLength.length > 2) {
          console.log("Second Ad found");
          //break;
          i++
          // ############### evaluate function for body distance #######
          const adRect = await page.evaluate((articles) => {
            function getCoords(elem) { // crossbrowser version
              var box = elem.getBoundingClientRect();

              var body = document.body;
              var docEl = document.documentElement;

              var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
              var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

              var clientTop = docEl.clientTop || body.clientTop || 0;
              var clientLeft = docEl.clientLeft || body.clientLeft || 0;

              var top = box.top + scrollTop - clientTop;
              var left = box.left + scrollLeft - clientLeft;

              return { top: Math.round(top) };
            }

            var offset_func = getCoords(articles);

            const {
              x,
              y,
              width,
              right,
              height
            } = articles.getBoundingClientRect();
            return {
              x,
              y,
              width,
              right,
              height, top_offset: offset_func.top
            };

          }, nextButton[0].asElement());
          console.log("width:" + adRect.width);
          console.log("height:" + adRect.height);
          console.log("top_offset:" + adRect.top_offset);

          // ######## scrolling into view ############
          await page.evaluate((element) => {
            element.scrollIntoView();
          }, nextButton[0].asElement());
          // ######## scrolling into view ############
          await delay(2000);
          // adding border
          await page.evaluate((element) => {
            element.style.border = '5px solid red';
          }, nextButton[0].asElement());

          await delay(2000);

          const adImg = currentUID + '-ad-desktop-side-' + i + '.jpeg';
          const adImgView = currentUID + '-ad-view-desktop-side-' + i + '.jpeg';

          console.log("Waiting for 5 seconds");
          await page.evaluate(() => {
            window.scrollTo(0, 0);
          })
          await delay(5000);
          console.log("Waiting for 5 seconds finished");
          console.log("taking screen shot");
          console.log(path + adImg)
          await page.screenshot({
            path: path + adImg,
            // clip: {
            //   x: adRect.x - 5, //x1
            //   y: adRect.top_offset - 75, //y1
            //   width: adRect.width + 10, //x2
            //   height: adRect.height + 100 //y2
            // }
            clip: {
              x: 890, //x1
              y: 80, //y1
              width: 410, //x2
              height: 170 //y2
            }
          });
          console.log("taking view shot");
          console.log(path + adImgView)

          await page.screenshot({
            path: path + adImgView,
            // clip: {
            //   x: adRect.x - 5, //x1
            //   y: adRect.top_offset - 75, //y1
            //   width: adRect.width + 10, //x2
            //   height: adRect.height + 500 //y2
            // }
            clip: {
              x: 890, //x1
              y: 80, //y1
              width: 410 + 40, //x2
              height: 170 + 500 //y2
            }
          });

          // removing border
          await page.evaluate((element) => {
            element.style.border = 'none';
          }, nextButton[0].asElement());
          try {
            // var nextButton = await page.$$('ytd-in-feed-ad-layout-renderer')

            //var button = await page.$$('ytd-in-feed-ad-layout-renderer button')
            var button = await page.$('#sparkles-container');
            const atag_href = await page.evaluate(() => {
              const button = document.querySelector('#sparkles-container');

              if (button) {
                const dataHost = button.__dataHost;
                if (dataHost && dataHost.__data) {
                  const navigationEndpoint = dataHost.__data.data.navigationEndpoint;
                  if (navigationEndpoint && navigationEndpoint.urlEndpoint) {
                    return navigationEndpoint.urlEndpoint.url;
                  }
                }
              }

              return null;
            });


            // await newPage.close();
            // // Switch back to the original page
            // await page.bringToFront();

            console.log("atag_href = " + atag_href);

            if (atag_href != null) {

              var iter_data = { platform_id: platform_id, keyword: keyword, keyword_id: keyword_id, role_id: role_id, href: atag_href, image_name: path + adImg, home_image_name: path + adImgView, home_url: url, };
              write2File(save_path + adImg.replace(".jpeg", ".txt"), JSON.stringify(iter_data), "overwrite");
            }
            await delay(2000);
          } catch (e) { console.log(e) }
          //	return true;
          //break;
          console.log("GO")
        }
        if (anchorTagLength.length > 0) {
          // var button = await page.$$('ytd-ad-slot-renderer ytd-in-feed-ad-layout-renderer a')
          var button = await page.$('ytd-ad-slot-renderer ytd-in-feed-ad-layout-renderer ytd-compact-promoted-video-renderer #thumbnail')
          // for (var i = 0; i < button.length; i++) {

          var atag_href = await page.evaluate((element) => {
            try {

              var href = element.href;
              return href;
            }
            catch (err) { }


          }, button);
          //   console.log(a_href);

          //   if (a_href != null && a_href != "" && a_href.includes("googleads") ) {
          //     atag_href=a_href;
          //     break;
          //   }
          // }
          if (atag_href != null && atag_href != "") {
            i++;

            console.log("atag_href = " + atag_href);
            console.log("Third type Ad found");
            //break;
            try {


              // ############### evaluate function for body distance #######
              const adRect = await page.evaluate((articles) => {
                function getCoords(elem) { // crossbrowser version
                  var box = elem.getBoundingClientRect();

                  var body = document.body;
                  var docEl = document.documentElement;

                  var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
                  var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                  var clientTop = docEl.clientTop || body.clientTop || 0;
                  var clientLeft = docEl.clientLeft || body.clientLeft || 0;

                  var top = box.top + scrollTop - clientTop;
                  var left = box.left + scrollLeft - clientLeft;

                  return { top: Math.round(top) };
                }

                var offset_func = getCoords(articles);

                const {
                  x,
                  y,
                  width,
                  right,
                  height
                } = articles.getBoundingClientRect();
                return {
                  x,
                  y,
                  width,
                  right,
                  height, top_offset: offset_func.top
                };

              }, anchorTag[0].asElement());
              console.log("width:" + adRect.width);
              console.log("height:" + adRect.height);
              console.log("top_offset:" + adRect.top_offset);

              // ######## scrolling into view ############
              await page.evaluate((element) => {
                element.scrollIntoView();
              }, anchorTag[0].asElement());
              // ######## scrolling into view ############
              await delay(2000);
              // adding border
              await page.evaluate((element) => {
                element.style.border = '5px solid red';
              }, anchorTag[0].asElement());

              await delay(2000);

              const adImg = currentUID + '-ad-desktop-side-' + i + '.jpeg';
              const adImgView = currentUID + '-ad-view-desktop-side-' + i + '.jpeg';

              console.log("Waiting for 5 seconds");
              await page.evaluate(() => {
                window.scrollTo(0, 0);
              })
              await delay(5000);
              console.log("Waiting for 5 seconds finished");
              console.log("taking screen shot");
              console.log(path + adImgView)

              await page.screenshot({
                path: path + adImg,
                // clip: {
                //   x: adRect.x - 5, //x1
                //   y: adRect.top_offset - 75, //y1
                //   width: adRect.width + 10, //x2
                //   height: adRect.height + 100 //y2
                // }
                clip: {
                  x: 890, //x1
                  y: 80, //y1
                  width: 410, //x2
                  height: 170 //y2
                }
              });
              console.log("taking view shot");
              console.log(path + adImgView)

              await page.screenshot({
                path: path + adImgView,
                // clip: {
                //   x: adRect.x - 5, //x1
                //   y: adRect.top_offset - 75, //y1
                //   width: adRect.width + 10, //x2
                //   height: adRect.height + 500 //y2
                // }
                clip: {
                  x: 890, //x1
                  y: 80, //y1
                  width: 410 + 40, //x2
                  height: 170 + 500 //y2
                }
              });

              // removing border
              await page.evaluate((element) => {
                element.style.border = 'none';
              }, anchorTag[0].asElement());
              try {
                //var anchorTagLength=await page.$$('ytd-ad-slot-renderer ytd-in-feed-ad-layout-renderer a');

                var iter_data = { platform_id: platform_id, keyword: keyword, keyword_id: keyword_id, role_id: role_id, href: atag_href, image_name: path + adImg, home_image_name: path + adImgView, home_url: url, };
                write2File(save_path + adImg.replace(".jpeg", ".txt"), JSON.stringify(iter_data), "overwrite");
                await delay(2000);
              } catch (e) { console.log(e) }
              //	return true;
              //break;
              console.log("GO")
            }
            catch (e) { }
          }
        }






        await page.goBack();
        console.log("Moving to next video");
        if(d>20){
          await browser.close();
          process.exit(1);
        }
      }

      console.log("articles are finished");
      console.log("going to exit");
      await browser.close();
      process.exit(1);

    }
    else {
      console.log("articles are not found ");
      console.log("going to exit");
      await browser.close();
      process.exit(1);

    }

    page.on('console', msg => {
      logIt("*********************************", 1);
      logIt("Console Message : ");
      logIt(msg.text());
      logIt("*********************************", 1);
    });

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
  return platform_id + "_" +
    Date.now();
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
