
//  Name: Nikita Sachivko 
//  Date: 10/10/2021 
//  Online (Heroku) Link: https://limitless-thicket-36072.herokuapp.com/ 


const data_service = require('./data-service.js');
const express = require('express');
const app = express();
const fs = require('fs');
const exphbs = require('express-handlebars');
const hbs = require('handlebars');
const HTTP_PORT = process.env.PORT || 8000;
var page = 1;
// var jsdom = require("jsdom");
// var JSDOM = jsdom.JSDOM;
// const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
// console.log(dom.window.document.querySelector("p").textContent);




app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

hbs.registerHelper('isEmpty', function (value, comparator) {
  comparator = "";
  return (value === comparator) ? false : true;
});

app.get('/', async (req, res) => {
  if (req.query.command == 'back' && page > 1) {
    page--;
  } else if (req.query.command == 'next') {
    page++;
  } else if (req.query.command == 'page'){
    if (req.query.number > 0)
      page = req.query.number;
  }

  var show_views = 0;
  let counter_data = JSON.parse(fs.readFileSync('./public/count.json'));
  var have_id = false;
  for (var i = 0; i < counter_data[0].length; i++) {
    if (counter_data[i].id == page) {
      have_id = true;
      counter_data[i].views++;
      show_views = counter_data[i].views;
    }
  }
  if (have_id == false) {
    const data = {
      id: page,
      views: 0
    }
    counter_data[counter_data[0].length] = data;
    counter_data[0].length++;
  }

  fs.writeFileSync('./public/count.json', JSON.stringify(counter_data));


  data_service.fetchData(page).then(data =>
    res.render('main',
      {
        data: data.data,
        layout: false,
        views: show_views
      })
  ).catch(error =>
    page = 1
    //console.log("Problems with data, at page ", page)
  );

});



app.use((req, res) => {
  res.status(404).send("ERROR 404, can't find page");
});
app.listen(HTTP_PORT, onHttpStart);

