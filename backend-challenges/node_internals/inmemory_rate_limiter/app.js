import express from 'express';
const app = express();
const port = 3000;

const rateLimitMap = new Map();

const WINDOW_SIZE = 60 * 1000; // 1 min
const MAX_REQUESTS = 10; // 10 req per min

app.set('trust proxy', true); 
// in Express.js tells the application it is running behind a reverse proxy 
// (like Nginx, Apache, or cloud load balancers). This ensures Express correctly identifies the client’s IP address 
// (-Forwarded-For) and protocol (-Forwarded-Proto) rather than the proxy's IP, which is vital for 
// secure cookies and rate limiting.

function rateLimiter(req, res, next) {
    if (req.path === '/favicon.ico') return next();
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const now = Date.now();

    let timestamps = rateLimitMap.get(ip) || [];

    // Remove old timestamps (optimized)
    while (timestamps.length && now - timestamps[0] >= WINDOW_SIZE) {
        timestamps.shift();
    }

    if (timestamps.length >= MAX_REQUESTS) {
        return res.status(429).send("Too many requests");
    }

    timestamps.push(now);

    if (timestamps.length === 0) {
        rateLimitMap.delete(ip);
    } else {
        rateLimitMap.set(ip, timestamps);
    }

    // Optional headers
    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", MAX_REQUESTS - timestamps.length);

    next();
}

app.use(rateLimiter);

app.get("/", (req, res) => {
    res.send({ message: "Hellu Subu Lets Comeback" });
});

app.get("/test", (req, res) => {
    res.send({ message: "Test route working" });
});

app.listen(port, () => {
    console.log("App listening on port...", port);
});