var page = require('webpage').create(status);

page.open('example.html', function () {

    console.log('WebPage Open Status: ' + status);
    page.renderBase64("PNG");
    phantom.exit();
    
});