// const puppeteer = require('puppeteer');
const twitter = require('./twitter');

(async ()=>{

    await twitter.initialize();
    
    await twitter.login('username','password');
    let tweets = await twitter.getTweets('RealMenFullBush',40);
    // await twitter.postTweet('this is generated by scrapper using node.js...');
    // let userDetail = await twitter.getUser('RealMenFullBush');
    debugger;

})()