const express =  require('express');
const router =  require( './routes');
const http =  require( 'http');
const app = express();

app.use('/', router);

//error handler
app.use((err, req, res, next) => {
    console.log(err);
    if (err.status) {
      res.sendStatus(err.status).send(err.message);
    }
  
    res.sendStatus(500).send('Internal server error');
});

const server = http.createServer(app);

server.listen(8080, () => {
  console.log( `server started on port 8080`);
});