export default function handler(req, res) {
	res.status(200).json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		method: req.method,
		url: req.url
	})
}
