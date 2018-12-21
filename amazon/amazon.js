const puppeteer = require('puppeteer');

let page = null;
let browser = null;

const BASE_URL = 'https://amazon.com/';
// const LOGIN_URL = 'https://twitter.com/login';

const amazon = {
    initialize: async ()=>{
        console.log('start to scrapper...');
        browser = await puppeteer.launch({headless:false});
        page = await browser.newPage();
        page.on('console', message=>{
            console.log(`this is a message from the browser ${message.text()}`);

        });
        await page.goto(BASE_URL, {waitUntil:'networkidle2'});

        console.log('initialization completed...');
    },

    getProductDetails: async (links)=>{

        await page.goto(links, {waitUntil: 'networkidle2'});
        let details = await page.evaluate(()=>{
            let title = document.querySelector('#productTitle').innerText.trim();
            let manufacturer = document.querySelector('#bylineInfo').innerText;
            //either # id of them as below example
            let currentPrice = document.querySelector('#priceblock_ourprice, #priceblock_dealprice').innerText;
            let rating = document.querySelector('#acrPopover').getAttribute('title');
            let totalRatings = document.querySelector('#acrCustomerReviewText').innerText;

            console.log('test');

            return {title,manufacturer,currentPrice,rating,totalRatings}

        });

        return details;

    },

    end: async()=>{
        console.log('stop the scrapper...');
        await browser.close();

    }

}

module.exports = amazon;