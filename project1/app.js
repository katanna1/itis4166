const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const crypticRoutes = require('./routes/crypticRoutes');
const { upload } = require('./public/middleware/fileUpload');


//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(methodOverride('_method'));

//set up routes
app.get('/', (req, res) =>{
    res.render('index');
})

app.use('/products', crypticRoutes);

app.post('/products', upload, (req, res) => {
    let product = req.body;
    product.id = uuidv4();
    product.imageUrl = '/media/items/' + req.file.filename;
    products.push(product);
    res.redirect('/products');
});

// Error Handling
app.use((req, res, next) => {
    let err = new Error("The server cannot locate " + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Sever Error.");
    }

    res.status(err.status);
    res.render('error', {error: err});
});


//start a server
app.listen(port, host, ()=> {
    console.log('Server is running on port ', port);
})