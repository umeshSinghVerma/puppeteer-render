const getBook = async (req,res,browser) => {
  bookName=req.query.searchBook;
  if(!bookName){
    res.send(`pleasy type the book name`);
    return;
  }
  try {
    const page  = await browser.newPage();
    await page.goto(`https://biblioreads.eu.org/search/${bookName}?type=books`);
    await page.waitForSelector('#booksSearchResults', { visible: true, timeout: 60000 });
    const element = '#booksSearchResults a'
    const booksData = await page.$$eval(element, anchors => {
        const books = anchors.map(anchor => {
            const title = anchor.querySelector('h3').textContent.trim();
            const author = anchor.querySelector('p').textContent.trim();
            const rating = anchor.querySelector('span.capitalize').textContent.trim();
            const coverImage = `https://biblioreads.eu.org${anchor.querySelector('img').getAttribute('src')}`;
            // const link = `https://biblioreads.eu.org${anchor.getAttribute('href')}`;
            const link = anchor.getAttribute('href');
            const bookInfo = {
                title,
                author,
                rating,
                coverImage,
                link
            };

            return bookInfo;
        });

        return books;
    });
    const dataToSave = {
        "data": booksData
    };
    res.send(dataToSave);
    await page.close();
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  }
};

module.exports = { getBook };
