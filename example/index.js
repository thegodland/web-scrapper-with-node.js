const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const URLs = [
    { url: 'https://www.imdb.com/title/tt1727824/?ref_=shtt_ov_tt',
        id: 'first_movie'
    },
    {
        url: 'https://www.imdb.com/title/tt4123430/?ref_=inth_ov_tt',
        id: 'second_movie'
    }
  ];

(async ()=>{
    let movieData = [];
    for(let movie of URLs){
        const response = await requestPromise({
            uri:movie.url,
            header:{
                'Accept': 'text/html,application/xhtml+xm…plication/xml;q=0.9,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Host': 'm.media-amazon.com',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel …) Gecko/20100101 Firefox/64.0'
            },
            gzip:true
        });
        let $ = cheerio.load(response);
        let title  = $('div[class="title_wrapper"] >h1').text().trim();
        let rating = $('span[itemprop="ratingValue"]').text();
        let image = $('div[class="poster"] > a > img').attr('src');
        let totalRating = $('span[itemprop="ratingCount"]').text();
        let releaseDate = $('a[title="See more release dates"]').text().trim();
        let genres = [];
        $('div[class="title_wrapper"] a[href^="/search/title?genres"]').each((i,ele)=>{
            let genre = $(ele).text();
            genres.push(genre);
    
        });

        movieData.push({
            title,
            rating,
            image,
            totalRating,
            releaseDate,
            genres
        });

        //download image using stream
        await new Promise((resolve,reject)=>{
            let file = fs.createWriteStream(`./example/${movie.id}.jpg`);
            request({
                uri:image,
                header:{
                    'Accept': 'text/html,application/xhtml+xm…plication/xml;q=0.9,*/*;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Connection': 'keep-alive',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel …) Gecko/20100101 Firefox/64.0'
                },
                gzip:true
            })
            .pipe(file)
            .on('finish', ()=>{
                console.log(`${movie.id} image has been downloaded`);
                resolve();
            })
            .on('error', (error)=>{
                reject(error);
            });

        })
        .catch( err=>{
            console.log(`${movie.id} image download has an error ${err}`);
        });

    
        // console.log(`title is ${title}`);
        // console.log(`rating is ${rating}`);
        // console.log(`image is ${image}`);
        // console.log(`total rating is ${totalRating}`);
        // console.log(`release data is ${releaseDate}`);
        // console.log(`genres are ${genres}`);

    }

    // const fields = ['title','rating'];
    // const json2csvParser = new Json2csvParser({ fields });
    // const csv = json2csvParser.parse(movieData);
    // fs.writeFileSync('./example/data.json',JSON.stringify(movieData),'utf-8');
    // fs.writeFileSync('./example/data.csv',csv,'utf-8');
    // console.log(csv);

})()


