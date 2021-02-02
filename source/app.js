const path=require('path')
const express=require("express")
const geocode=require("./utils/geocode")
const forecast=require('./utils/forecast')
const hbs=require("hbs")
const app=express()

// define path for express config
const publicDirectoryPath = path.join(__dirname,"../public")
const viewsPath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname,"../templates/partials")

//setup handlebars engines and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve 
app.use(express.static(publicDirectoryPath))
app.get('', (req, res) => {
    res.render('index',{
        title:'Weather',
        Name:'Sparsh Bhardwaj'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title:'About Me',
        Name:'Sparsh Bhardwaj'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error:"You must have provided a search term."
        })
    }
    console.log(req.query.search)
    res.send({
        'products':[]
    })
})

app.get('/help', (req, res) => {
    res.render('help',{
        title:'Help',
        Name:'Sparsh'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404page',{
        title:'404',
        Name:'Sparsh',
        errorMessage:"Help Article Not Found!!"
    })
})

app.get('*', (req, res) => {
    res.render('404page',{
        title:'404',
        Name:'Sparsh',
        errorMessage:"Page not Found!!"
    })
})

app.listen(3000,()=>{
    console.log("Server is start listening on port 3000.")
})