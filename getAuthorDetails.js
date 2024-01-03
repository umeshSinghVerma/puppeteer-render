async function GetAuthorData(authorUrl, browser) {
    const newpage = await browser.newPage();
    try {
        console.log("this is the url", authorUrl);
        const link = authorUrl.replace(/^"|"$/g, '');
        await newpage.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await newpage.waitForSelector('#authorContent', { visible: true, timeout: 60000 });


        const authorDescription = await newpage.evaluate(() => {
            const bookDescriptionElement = document.querySelector('#authorContent #authorDescription > span');
            if (bookDescriptionElement) {
                let text = bookDescriptionElement.textContent.trim();
                text = text.replace(/\(Show less\)$/, '').trim();
                return text;
            }
            return '';
        });
        await newpage.close();
        return authorDescription;

    }
    catch (err) {
        if (err.name === 'TimeoutError') {
            console.log("Timeout occurred, returning empty object");
            return {}; // Returning an empty object
        } else {
            console.log(err);
            return {}; // Catch other errors and return an empty object
        }

    }
}
async function getAuthorDetail(req,res,browser){

}


const finalAuthorArray = async function () {
    let authors = [];
    for (let i = 0; i < authorss.length; i++) {
        let author = authorss[i];
        let authorDescription = await GetAuthorData(author.url, browser);
        let authorObject = {
            authorName: author.name,
            aboutAuthor: authorDescription
        };
        authors.push(authorObject);
    }
    return authors;
}
const AuthorDetails = await finalAuthorArray();