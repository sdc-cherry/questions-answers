const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded( {extended: true} ))

const PORT = 3000;


// const compression = require('compression');
// app.use(compression());

// app.use(express.static(__dirname + '/public'));

// const api = require('./server_utils/atelierAPI.js')
// app.all('/*', function (req, res) {
//   api.callAtelierAPI(req.method, req.url, req.body)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       return err;
//     })
// })

app.get('/', (req, res) => {
  res.send('Hello World from SDC!');
})


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
});









