const http = require('http');
const url = require('url');
const fs = require('fs');
const replace = require('./modules/templateReplace');

const homePage = fs.readFileSync(`${__dirname}/templates/index.html`, 'utf-8');
const productPage = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const cards = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

http
  .createServer((req, res) => {
    // console.log(url.parse(req.url, true));
    const { pathname, query } = url.parse(req.url, true);
    console.log(query, pathname);
    const pathName = req.url;

    // Checking the path
    if (pathname === '/' || pathname === '/overview') {
      res.writeHead(200, { 'content-type': 'text/html' });

      const products = dataObj.map((item) => replace(cards, item)).join('');
      const output = homePage.replace(/{%CARDS%}/g, products);
      res.write(output);
      res.end();
    } else if (pathname === '/product') {
      res.writeHead(200, { 'content-type': 'text/html' });
      const product = dataObj[query.id];

      const output = replace(productPage, product);
      res.write(output);
      res.end();
    } else if (pathname === '/api') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.write(data);
      res.end();
    } else {
      res.writeHead(404, { 'content-type': 'text/html' });
      res.write('<h4>Page not found</h4>');
      res.end();
    }
  })
  .listen(8000, () => {
    console.log(`The server is running`);
  });
