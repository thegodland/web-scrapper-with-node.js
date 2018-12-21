const Nightmare = require('nightmare');
require('nightmare-inline-download')(Nightmare);

let nightmare = null;

const ycombinator = {
    initialize : async ()=>{
        nightmare = Nightmare({show:true});
    },

    getNews: async (limit=30)=>{

        await nightmare.goto('https://news.ycombinator.com/news');
        let articles = [];
        let isPagination = null;

        do{
            let new_articles = await nightmare.evaluate( ()=>{
                let tableRows = document.querySelectorAll('table[class="itemlist"] > tbody > tr');
                
                let articles = [];
                for (let row of tableRows){
                    if (row.getAttribute('class')=='spacer') continue;
                    if (row.getAttribute('class')=='athing'){
                        
                        let title = row.querySelector('td[class="title"] > a').innerText;
                        let url = row.querySelector('td[class="title"] > a').getAttribute('href');
                        let source = row.querySelector('span[class="sitebit comhead"] > a') ? row.querySelector('span[class="sitebit comhead"] > a').innerText : false;
                        let newRow = row.nextSibling;
                        let points = newRow.querySelector('span[class="score"]') ? newRow.querySelector('span[class="score"]').innerText : false;
                        let writer = newRow.querySelector('a[class="hnuser"]') ? newRow.querySelector('a[class="hnuser"]').innerText : false;
                        let date = newRow.querySelector('span[class="age"]') ? newRow.querySelector('span[class="age"]').innerText:false;
                        let comments = newRow.querySelectorAll('a')[3] ? newRow.querySelectorAll('a')[3].innerText:false;
    
                        articles.push({title,url,source, points, writer,date,comments});
                    }
                }
    
                return articles;
            
            });

            articles = [
                ...articles,
                ...new_articles
            ];
            isPagination = await nightmare.exists('a[class="morelink"]');
            if(isPagination && articles.length < limit){
                await nightmare.click('a[class="morelink"]');
                await nightmare.wait('table[class="itemlist"]');
            }

        }while(articles.length < limit && isPagination);

        return articles.splice(0,limit);
    },

    download: async ()=>{
        await nightmare.goto('https://discordapp.com/download');
        await nightmare.click('a[class="download-btn"]');
        let download = await nightmare.download('./nightmarejs/code.dmg');
        debugger;
    },

    injection: async ()=>{
        //*** */every time url changed, the nightmare have to inject the jquery again ***//
        const jQueryPath = './nightmarejs/jquery-3.3.1.min.js';
        await nightmare.goto('https://news.ycombinator.com/news');
        await nightmare.inject('js',jQueryPath);
        await nightmare.click('a[class="morelink"]');
        await nightmare.inject('js',jQueryPath);
        await nightmare.wait('table[class="itemlist"]');
        let title = await nightmare.evaluate( ()=>{
            let first = $('table[class="itemlist"] > tbody > tr:first td[class="title"] > a').text();
            return first;
        });
        console.log(title);

        debugger;
    }


}
module.exports = ycombinator;