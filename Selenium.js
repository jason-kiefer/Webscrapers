const { Builder, By, Key, until } = require('selenium-webdriver');
const selenium = require('selenium-webdriver');
let chrome = require('selenium-webdriver/chrome');
let chromedriver = require('chromedriver');
let gecko = require('geckodriver');
let JSSoup = require('jssoup').default;

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
            let html = new JSSoup(page).findAll('p');
            trie.createWord('cheese');
            for (let i =0 ; i < 3 ; i++)
                trie.insertDefinition('cheese', html[i].text.trim());
            trie.traverse('cheese');
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
        //driver.quit();
    }
};

class LinkedList {
    constructor() {
        this.head = null;
    }
}

class Definition {
    constructor(description = null) {
        this.description = description;
        this.next = null;
    }
}

class Word {
    constructor() {
        this.definitions = new LinkedList();
    }
}

class Trie {
    constructor() {
        this.root = {}
    }

    insertList(list) {
        list.forEach(el => {
            return this.insert(el);
        })
    }
    
    createWord(word, root = this.root) {
        if(!root)
            this.root = root;
        [...word].forEach(el => {
            if (!root[el])
                root[el] = new Word();
            root = root[el]
        })
        root = new Word();
    }

    insertDefinition(word, description, root = this.root) {
        [...word].forEach(el => {
            if (!root[el])
                return null;
            root = root[el]
        })
        
        let node = root.definitions.head;
        
        if (!node) {
            root.definitions.head = new Definition(description);
            return;
        }
        

        while(node.next) 
            node = node.next;
        node.next = new Definition(description);
    }

    traverse(value, root = this.root) {

        process.stdout.write('Searching for \'' + value + '\': \n');

        [...value].forEach(el => {
            root = root[el]
        })

        let head = root.definitions.head

        while(head) {
            head 
                ? process.stdout.write(head.description.toString() + '\n\n')
                : process.stdout.write('No definitions found\n');
            head = head.next;
        }
    }
}

let trie = new Trie();

function main() {
    scrape();
}

main();