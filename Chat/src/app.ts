import express from 'express'
import dotenv from 'dotenv';

dotenv.config({ path: './.env' })

const app = express();

app.get('/', (req, res) => {

    res.send({ message: "Hi Subu You are going great",  })
})

const PORT = process.env.PORT || 5010;

app.listen(PORT, () => {
    console.log("Running ......... On Port " + PORT)
})