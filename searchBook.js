
const searchBook = async (req, res, browser) => {
  const url = req.query.bookUrl;
  if (!url) {
    res.send(`pleasy type the book url`);
    return;
  }
  try {
    const page = await browser.newPage();

    console.log("this is the url", url);
    const link = url.replace(/^"|"$/g, '');
    await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForSelector('#bookContent', { visible: true, timeout: 60000 });

    const description = await page.evaluate(() => {
      const bookDescriptionElement = document.querySelector('#bookContent #bookDescription > p');
      if (bookDescriptionElement) {
        let text = bookDescriptionElement.textContent.trim();
        text = text.replace(/\(Show less\)$/, '').trim();
        return text;
      }
      return '';
    });

    const topics = await page.evaluate(() => {
      const bookTopicElement = document.querySelector('#bookContent #bookGenres > span');
      if (bookTopicElement) {
        let text = bookTopicElement.textContent.trim();
        return text;
      }
      return '';
    });

    const bookRating = await page.evaluate(() => {
      const bookRatingElement = document.querySelector('#bookContent #bookRating > div > div > span');
      if (bookRatingElement) {
        let rating = bookRatingElement.textContent.trim();
        return rating;
      }
      return '';
    });

    await page.waitForSelector('#sideContent', { visible: true, timeout: 60000 });
    const slogan = await page.evaluate(() => {
      const sloganElement = document.querySelector('#sideContent a');
      if (sloganElement) {
        let slogan = sloganElement.textContent.trim();
        return slogan;
      }
      return '';
    });
    const authorLinks = await page.evaluate(() => {
      const sloganElement = document.querySelector('#sideContent div');
      let authors = [];

      if (sloganElement) {
        Array.from(sloganElement.children).map((spanElement) => {
          if (spanElement.children.length == 1) {
            let AuthorObject = {
              name: spanElement.children[0].textContent.replace(',', "").trim(),
              url: `https://biblioreads.eu.org${spanElement.children[0].getAttribute('href')}`,
            };
            authors.push(AuthorObject);
          }
        });
      }
      return authors;
    });


    const title = await page.evaluate(() => {
      const titleElement = document.querySelector('#sideContent h1');
      if (titleElement) {
        let title_ = titleElement.textContent.trim();
        return title_;
      }
      return '';
    });

    const author = await page.evaluate(() => {
      const authorElement = document.querySelector('#sideContent div');
      if (authorElement) {
        let author_ = authorElement.textContent.trim();
        return author_;
      }
      return '';
    });

    const imgUrl = await page.evaluate(() => {
      const imgElement = document.querySelector('#sideContent #bookCover picture img');
      if (imgElement) {
        let imgSrc = imgElement.getAttribute('src');
        return imgSrc;
      }
      return '';
    });


      const dataToSave = {
        "topics": topics,
        "description": description,
        "rating": bookRating,
        "slogan": slogan,
        "title": title,
        "author": author,
        "authorLinks": authorLinks,
        "imgUrl": `https://biblioreads.eu.org${imgUrl}`
      };
      res.send(dataToSave)
      await page.close();
      return dataToSave;
    } catch (e) {
      console.error(e);
      res.send(`Something went wrong while running Puppeteer: ${e}`);
    }
  };

  module.exports = { searchBook };
