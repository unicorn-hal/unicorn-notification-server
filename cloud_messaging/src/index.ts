import express from 'express';
import { SendMessage } from './module/send_message';
import { AuthenticationService } from './module/service/firebase/authentication_service';
import { CloudMessagingService } from './module/service/firebase/cloud_messaging_service';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next();
});

app.use(async (req, res, next) => {
    // Check Bearer token
    const bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
        res.status(403).send('Forbidden');
        return;
    }

    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const authService = new AuthenticationService();
    try {
        await authService.verifyIdToken(bearerToken);
        next();
    } catch (error) {
        res.status(403).send('Forbidden');
    }
});

app.get('/', (_, res) => {
    res.status(200).send('Hello World!');
});
app.post('/send', async (req, res) => {
    const sendMessage = new SendMessage(req, res);
    await sendMessage.useToken();
});
app.post('/multicast', async (req, res) => {
    const sendMessage = new SendMessage(req, res);
    await sendMessage.useMulticast();
});
app.post('/topic', async (req, res) => {
    const sendMessage = new SendMessage(req, res);
    await sendMessage.useTopic();
});
app.post('/subscribe', async (req, res) => {
    const sendMessage = new SendMessage(req, res);
    await sendMessage.subscribeToTopic();
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});