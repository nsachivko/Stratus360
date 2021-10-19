
const data_service = require("./data-service.js")
const express = require("express")
const app = express()
const fs = require("fs")
const exphbs = require("express-handlebars")
const hbs = require("handlebars")
const HTTP_PORT = process.env.PORT || 8000
var page = 1


app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")
app.use(express.static(__dirname + "/public"))

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT)
}

function renderPage(page, res) {
  var show_views = 0
  let counter_data = JSON.parse(fs.readFileSync("./public/count.json"))
  var have_id = false
  for (var i = 0; i < counter_data[0].length; i++) {
    if (counter_data[i].id == page) {
      have_id = true
      counter_data[i].views++
      show_views = counter_data[i].views
    }
  }
  if (have_id == false) {
    const data = {
      id: page,
      views: 0,
    }
    counter_data[counter_data[0].length] = data
    counter_data[0].length++
  }

  fs.writeFileSync("./public/count.json", JSON.stringify(counter_data))

  data_service
    .fetchData(page)
    .then((data) =>
      res.render("main", {
        data: data.data,
        layout: false,
        views: show_views,
      })
    )
    .catch((error) => (page = 1))
}

hbs.registerHelper("isEmpty", function (value, comparator) {
  comparator = ""
  return value === comparator ? false : true
})

app.get("/", async (req, res) => {

  if (req.query.command == "back" && page != 1 && page > 0) {
    page -= 1;
    renderPage(page, res)
  } else if (req.query.command == "next") {
    page += 1;
    renderPage(page, res)
  } else if (req.query.command == "page") {
    page = parseInt(req.query.number);
    if (page > 0) {
      renderPage(page, res)
    }
  } else if (req.query.command == "random") {
    data_service.fetchCurrentCom().then((data) => {
      page = Math.floor(Math.random() * (data.data.num - 1) + 1)
      renderPage(page, res)
    })
  } else {
    renderPage(1, res)
  }
})

app.use((req, res) => {
  res.status(404).send("ERROR 404, can't find page")
})
app.listen(HTTP_PORT, onHttpStart)