const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const crypticRoutes = require('./routes/crypticRoutes');
const mongoose = require('mongoose');
const { upload } = require('./public/middleware/fileUpload');


//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/crypticDB';
app.set('view engine', 'ejs');
const mongUri = 'mongodb+srv://kwils178:peoOSC87PdbpvZCv@itis4166.rv6js.mongodb.net/crypticDB?retryWrites=true&w=majority&appName=ITIS4166';

//connect to database MongoDB
mongoose.connect(mongUri)
.then(()=> {
    //start the server
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));



//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
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

