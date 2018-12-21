const ycombinator = require('./ycombinator');

(async ()=>{

    await ycombinator.initialize();
    // let news = await ycombinator.getNews(98);
    // console.log(news);

    // await ycombinator.download();

    await ycombinator.injection();
    debugger;

})();