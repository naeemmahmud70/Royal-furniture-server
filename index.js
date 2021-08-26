const express = require('express')
const cors = require("cors");
const bodyParser = require('body-parser')
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { response } = require('express');

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clvrh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const productsCollection = client.db("furniture").collection("products");
    const ordersCollection = client.db("furniture").collection("orders");
    const blogsCollection = client.db("furniture").collection("blogs");
    const reviewsCollection = client.db("furniture").collection("reviews");
    const adminsCollection = client.db("furniture").collection("admins");

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productsCollection.insertOne(newProduct)
            .then(result => {
                res.redirect('/')
            });
    });

    app.get('/products', (req, res) => {
        productsCollection.find()
            .toArray((err, products) => {
                res.send(products)
            });
    });

    app.delete('/deleteProduct/:id', (req, res) => {
        productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result)
            });
    });

    app.get('/orderProduct/:id', (req, res) => {
        productsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            });
    });

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder)
            .then(result => {
                res.send(result)
            });
    });

    app.get('/seeOrders', (req, res) => {
        console.log(req.query.email)
        ordersCollection.find({ email: req.query.email })
            .toArray((err, orders) => {
                res.send(orders)
            });
    });

    app.get('/manageOrders', (req, res) => {
        ordersCollection.find()
            .toArray((err, orders) => {
                res.send(orders);
            })
    })

    app.delete('/cancel/:id', (req, res) => {
        ordersCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result)
            });
    });

    app.post('/todaysOrder', (req, res) => {
        const date = req.body.date;
        ordersCollection.find({ oderTime: date })
            .toArray((err, documents) => {
                res.send(documents)
            });
    });

    app.post('/pendingOrder', (req, res) => {
        const status = req.body.status;
        ordersCollection.find({ orderStatus: status })
            .toArray((err, documents) => {
                res.send(documents)
            });
    });

    app.post('/addBlog', (req, res) => {
        const newBlog = req.body;
        blogsCollection.insertOne(newBlog)
            .then(result => {
                res.send(result)
                res.redirect('/')
            });
    });

    app.get('/blogs', (req, res) => {
        blogsCollection.find()
            .toArray((err, blogs) => {
                res.send(blogs)
            });
    });

    app.get('/fullBlog/:id', (req, res) => {
        blogsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.delete('/deleteBlog/:id', (req, res) => {
        blogsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result)
            });
    });

    app.post('/addReview', (req, res) => {
        const newReview = req.body;
        reviewsCollection.insertOne(newReview)
            .then(result => {
                res.send(result)
                res.redirect('/')
            });
    });

    app.get('/reviews', (req, res) => {
        reviewsCollection.find()
            .toArray((err, reviews) => {
                res.send(reviews)
            });
    });

    app.patch('/update/:id', (req, res) => {
        const ordersStatus = req.body.status;

        ordersCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { orderStatus: ordersStatus }
            })

            .then(result => {
                res.send(result)

            });
    });

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminsCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result)
            });
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminsCollection.find({ email: email })
            .toArray((err, admin) => {
                res.send(admin.length > 0)
            })
    });

});

app.listen(port)
