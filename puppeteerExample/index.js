const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');

(async () => {
    //default view port is 800*600
  const browser = await puppeteer.launch({
      headless:false,
      ignoreHTTPSErrors:true,
      defaultViewport:{
          width:1920,
          height:1080
      },
      //this is a public ip
      args: ['--proxy-server=128.199.154.45:8080']
        // devtools:true
    });
  const page = await browser.newPage();

  //to test if we changed the ip by using proxy server
  await page.goto('https://httpbin.org/ip');
  debugger;

  // basic http auth method
  await page.authenticate({username:'admin', password:'admin'});
  await page.goto('https://httpbin.org/basic-auth/admin/admin');
  debugger;

  //add interception to speed up loading 
  await page.setRequestInterception(true);
  page.on('request', request=>{
      if(['image','stylesheet','font'].includes(request.resourceType())){
          request.abort();
      }else{
          request.continue();
      }
  });

  await page.goto('https://amazon.com');
 

    //emulate a phone view
    await page.emulate(devices['iPhone X']);
  await page.goto('https://www.google.com');
  //create a pdf headless must be set to true
  await page.pdf({
      path: './puppeteerExample/page.pdf',
      format:'A4'
  })
  //get the url and title of website
  let title = await page.title();
  console.log(`the title is ${title}`);
  let url = await page.url();
  console.log(`the url of website is ${url}`);

  await page.type('.gLFyf','xiang liu',{delay:100});
  await page.keyboard.press('Enter');
  await page.waitForNavigation();

  await page.screenshot({path: './puppeteerExample/example.png'});

//   debugger;
  await browser.close();
})();