
//Selenium example with JSSoup

const { Builder, By, Key, until } = require('selenium-webdriver');
const selenium = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const JSSoup = require('jssoup').default;

require('geckodriver');

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

async function scrape() {

    var capabilities = selenium.Capabilities.chrome();

    let driver = await new Builder()
        .forBrowser('chrome')
        .withCapabilities(capabilities)
        .build();

    try {
        await driver.get('https://www.google.com');

        await driver.findElement(By.name('q')).sendKeys('cheese wikipedia', Key.ENTER);

        await driver.wait(until.elementLocated(By.css('h3')), 10000).click();

        driver.getPageSource()
        .then(async page => {
            let pTags = new JSSoup(page).findAll('p');
            driver.findElements(By.xpath('//*[@class="mw-parser-output"]//a'))
            .then(aTags => {
                //aTags[1].click();
                aTags.forEach(async a => {
                    console.log(await a.getAttribute("href"));
                })
            })

        })
    }
    finally {
        driver.quit();
    }
};