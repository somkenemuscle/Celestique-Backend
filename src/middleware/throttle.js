import throttle from 'express-throttle';

export default throttle({
    burst: 10,       // Number of requests allowed in a burst
    rate: '5/s',     // Number of requests allowed per second
    delay: 100       // Delay in milliseconds between bursts
});
