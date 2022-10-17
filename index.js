const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify");
///////////////////

// Files

// Blocking, synchronous way
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");

const tempProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

// const textOut = `This is what we know about the avocado: ${textIn}\n Created on ${Date.now()}`;

// console.log(textOut);
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File has been written!");
fs.writeFileSync("./txt/hello.xt", "Hello World!");
console.log("File has been written!");

// Non-Blocking, Asynchronous way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR! 💥");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2}\n${data3}`,
//         "utf-8",
//         (err) => {}
//       );
//       console.log("Youre file has been written! 😃");
//     });
//   });
// });

// console.log("Will read file..");

/////////////////
// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);
//console.log(dataObject);
const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    //console.log(cardsHtml);
    res.end(output);

    //Products page
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //console.log(query);

    //API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // Not found page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1> ");
  }
});
// Starting the server
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000...");
});
