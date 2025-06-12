import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'

const BOT_TOKEN = process.env.BOT_TOKEN || ''

interface TelegramInitData {
	query_id: string
	user: {
		id: number
		first_name: string
		last_name?: string
		username?: string
		language_code?: string
	}
	auth_date: number
	hash: string
}

export const validateTelegramWebAppData = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const initData = req.headers['x-telegram-init-data'] as string
		if (!initData) {
			return res.status(401).json({ error: 'No Telegram data provided' })
		}

		const urlParams = new URLSearchParams(initData)
		const hash = urlParams.get('hash')
		urlParams.delete('hash')

		const dataCheckString = Array.from(urlParams.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, value]) => `${key}=${value}`)
			.join('\n')

		const secret = crypto
			.createHmac('sha256', 'WebAppData')
			.update(BOT_TOKEN)
			.digest()

		const calculatedHash = crypto
			.createHmac('sha256', secret)
			.update(dataCheckString)
			.digest('hex')

		if (calculatedHash !== hash) {
			return res.status(401).json({ error: 'Invalid Telegram data' })
		}

		const telegramData: TelegramInitData = {
			query_id: urlParams.get('query_id') || '',
			user: JSON.parse(urlParams.get('user') || '{}'),
			auth_date: parseInt(urlParams.get('auth_date') || '0'),
			hash: hash || ''
		}

		req.telegramUser = telegramData.user
		next()
	} catch (error) {
		console.error('Telegram auth error:', error)
		res.status(401).json({ error: 'Invalid Telegram data' })
	}
}

declare global {
	namespace Express {
		interface Request {
			telegramUser?: TelegramInitData['user']
		}
	}
}
