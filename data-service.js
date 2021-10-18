// const fs = require('fs');
// var employees = new Array();
// var departments = new Array();
const axios = require("axios");

// const fetchData = (id) => {
//     var data = new Array();
//      for (var i = 0; i < 10; i++){
//          data.push(axios.get(`https://xkcd.com/${id}/info.0.json`));
//     }
//     console.log(data[0]);
//     return data[id];
// }
// module.exports = { fetchData }

async function fetchData (id) {
    const api_path = `https://xkcd.com/${id}/info.0.json`;
    const data = axios.get(api_path);
    return data;
}
module.exports = { fetchData }


