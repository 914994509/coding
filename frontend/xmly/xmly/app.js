const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors());
app.use('/music', express.static('music'))

app.use('/api', require('./router'))

const PORT = 3000

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))