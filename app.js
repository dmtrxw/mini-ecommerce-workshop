const express = require('express')
const app = express()
const PORT = 3000

const { dbConnect } = require('./lib/db')

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', async function (req, res) {
    const db = await dbConnect()
    const products = await db.all('SELECT * FROM products')

    res.render('home', { products })

    db.close()
})

app.get('/order/:id', async function (req, res) {
    const db = await dbConnect()
    const product = await db.get('SELECT * FROM products WHERE id = $id', {
        $id: req.params.id,
    })

    res.render('order', { product })

    db.close()
})

app.post('/order/:id', async function (req, res) {
    const db = await dbConnect()
    const product = await db.get('SELECT * FROM products WHERE id = $id', {
        $id: req.params.id,
    })
    await db.run(
        'INSERT INTO orders (product_id, customer_name, customer_email, customer_address, order_item_qty, order_item_price)' +
            'VALUES ($product_id, $customer_name, $customer_email, $customer_address, $order_item_qty, $order_item_price)',
        {
            $product_id: product.id,
            $customer_name: req.body.customer_name,
            $customer_email: req.body.customer_email,
            $customer_address: req.body.customer_address,
            $order_item_qty: req.body.order_item_qty,
            $order_item_price: product.price,
        }
    )

    res.redirect('/thankyou')

    db.close()
})

app.get('/thankyou', async function (req, res) {
    res.render('thankyou')
})

app.listen(PORT, function () {
    console.log('Mini e-commerce running on port', PORT)
})
