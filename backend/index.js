const express = require('express')
const cors = require('cors')

const app = express()
app.use(
    express.urlencoded({
        extended: false,
    })
)
app.use(express.json())
// app.use(express.text())


app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use(express.static('public', { extensions: ['png'] }))
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')
app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

app.listen(5000)
