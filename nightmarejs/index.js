const Nightmare = require('nightmare')
//ope dev tools
const nightmare = Nightmare({ 
    show: true,
    openDevTools: {
        mode: 'detach'
    } 
});

(async ()=>{
    try{
        // custom the view port
        await nightmare.viewport(1200,600);
        await nightmare.goto('https://duckduckgo.com');

        //scroll down to the end of page
        let height = await nightmare.evaluate( ()=>document.body.scrollHeight);
        await nightmare.scrollTo(height,0);

        //wait for a specific selector to be found on a page
        await nightmare.wait('#selector');
        // click a selector
        await nightmare.click('#selector');
        //type
        await nightmare.type('#selector', 'string to type');
        //return true if selector is found on the page else false
        let is_selector = await nightmare.exists('#selector');
        //return true if selector is visible and not hiddle
        let is_visible = await nightmare.visible('#selector');
        //return url & title
        let current_url = await nightmare.url();
        let title = await nightmare.title();

        await nightmare.type('#search_form_input_homepage', 'github nightmare');
        await nightmare.click('#search_button_homepage');
        await nightmare.wait('#r1-0 a.result__a')
        let link = await nightmare.evaluate(() => document.querySelector('#r1-0 a.result__a').href);
        await nightmare.end(); 
        console.log(link);

    }catch(error){
        console.log('Search failed:', error);
    }

})();
