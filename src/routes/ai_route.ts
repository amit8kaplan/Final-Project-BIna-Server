import express from 'express';
const router = express.Router();
const axios = require('axios');
router.post('/', (req, res) => {
    console.log("req.body", req.body);
    axios.post('http://127.0.0.1:5000/ai', req.body)
    .then((response) => {
        console.log("response.data", response.data);
        res.send(response.data);
    })
    .catch((error) => {
        console.error(error);
    });
});

export default router;