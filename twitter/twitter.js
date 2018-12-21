const puppeteer = require('puppeteer');

let page = null;
let browser = null;

const BASE_URL = 'https://twitter.com/';
const LOGIN_URL = 'https://twitter.com/login';
const USERNAME_URL = username => `https://twitter.com/${username}`;


const twitter = {
    initialize: async ()=>{
        browser = await puppeteer.launch({
            headless:false
        });
        page = await browser.newPage();
    
        await page.goto(BASE_URL);
    },

    login: async (username,password)=>{
        await page.goto(LOGIN_URL);

        await page.waitFor('form[class="t1-form clearfix signin js-signin"] input[name="session[username_or_email]"]');
        await page.type('form[class="t1-form clearfix signin js-signin"] input[name="session[username_or_email]"]',username, {delay:25});
        await page.type('form[class="t1-form clearfix signin js-signin"] input[name="session[password]"]',password,{delay:25});
        await page.click('button[type="submit"][class="submit EdgeButton EdgeButton--primary EdgeButtom--medium"]');
        await page.waitFor('#tweet-box-home-timeline');
        await page.waitFor(1000);
    },

    postTweet: async message=>{
        let url = await page.url();
        
        if (url != BASE_URL){
            await page.goto(BASE_URL);
        }

        await page.waitFor('#tweet-box-home-timeline');
        await page.click('#tweet-box-home-timeline');
        await page.waitFor(500);
        await page.keyboard.type(message, {delay:50});
        await page.click('button[class="tweet-action EdgeButton EdgeButton--primary js-tweet-btn"]');
    },

    getUser: async username=>{
        let url = await page.url();
        if (url != USERNAME_URL(username)){
            await page.goto(USERNAME_URL(username));
        }

        await page.waitFor('h1[class="ProfileHeaderCard-name"] > a');

        let details = await page.evaluate( ()=>{
            return {
                fullName: document.querySelector('h1[class="ProfileHeaderCard-name"] > a') ? document.querySelector('h1[class="ProfileHeaderCard-name"] > a').innerText : '',
                description: document.querySelector('p[class="ProfileHeaderCard-bio u-dir"]') ? document.querySelector('p[class="ProfileHeaderCard-bio u-dir"]').innerText : '',
                followerCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--followers"] > a > span[class="ProfileNav-value"]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--followers"] > a > span[class="ProfileNav-value"]').getAttribute('data-count') : '',
                followingCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--following"] > a > span[class="ProfileNav-value"]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--following"] > a > span[class="ProfileNav-value"]').getAttribute('data-count') : '',
                location: document.querySelector('span[class="ProfileHeaderCard-locationText u-dir"]') ? document.querySelector('span[class="ProfileHeaderCard-locationText u-dir"]').innerText.trim() : '',
                link: document.querySelector('span[class="ProfileHeaderCard-urlText u-dir"] > a') ? document.querySelector('span[class="ProfileHeaderCard-urlText u-dir"] > a').getAttribute('title') : '',
                joinedDate: document.querySelector('span[class="ProfileHeaderCard-joinDateText js-tooltip u-dir"]') ? document.querySelector('span[class="ProfileHeaderCard-joinDateText js-tooltip u-dir"]').innerText : '',
                tweetsCount: document.querySelector('li[class="ProfileNav-item ProfileNav-item--tweets is-active"] > a > span[class="ProfileNav-value"]') ? document.querySelector('li[class="ProfileNav-item ProfileNav-item--tweets is-active"] > a > span[class="ProfileNav-value"]').getAttribute('data-count') : ''

            }
        });
        debugger;
        return details;
     
    },

    getTweets: async (username, count=10)=>{

        let url = await page.url();
        if (url != USERNAME_URL(username)){
            await page.goto(USERNAME_URL(username));
        }

        await page.waitFor('#stream-items-id');

        let tweetArray = await page.$$('#stream-items-id > li');
        let lastTweetsArrayLength = 0;
        let tweets = [];

        while(tweetArray.length < count){
            await page.evaluate(`window.scrollTo(0,document.body.scrollHeight)`);
            await page.waitFor(3000);
            tweetArray = await page.$$('#stream-items-id > li');
            if(lastTweetsArrayLength == tweetArray.length) break;
            lastTweetsArrayLength = tweetArray.length;
        }

        for(let tweetElement of tweetArray){
            let contents = await tweetElement.$eval('div[class="js-tweet-text-container"]', element=> element.innerText);
            //still have issue for the likesCount
            let likesCount = await tweetElement.$eval('div[class="ProfileTweet-action ProfileTweet-action--favorite js-toggleState"] span[class="ProfileTweet-actionCount"]', element=> element.getAttribute('data-tweet-stat-count'));
            let retweetCount = await tweetElement.$eval('div[class="ProfileTweet-action ProfileTweet-action--retweet js-toggleState js-toggleRt"] span[class="ProfileTweet-actionCountForPresentation"]', element=>element.innerText);

            tweets.push({contents, likesCount, retweetCount});
        }

        tweets = tweets.slice(0,count);

        return tweets;

    },

    end: async ()=>{
        await browser.close();
    }

}

module.exports = twitter;