export default function handler(req, res) {
    res.json({
        message: 'Movies Library API',
        version: '1.0.0',
        status: 'Running',
    });
}
