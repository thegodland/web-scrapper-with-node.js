const amazon = require('./amazon');

// https://www.amazon.com/dp/B0792KTHKJ/
// https://www.amazon.com/All-new-Echo-Plus-Bundle-Philips/dp/B07H1QBW2L

(async ()=>{

    await amazon.initialize();
    let details = await amazon.getProductDetails('https://www.amazon.com/dp/B0792KTHKJ/');
    debugger;

})();