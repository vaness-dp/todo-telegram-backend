import { CorsOptions } from 'cors'
import dotenv from 'dotenv'
import { HelmetOptions } from 'helmet'

dotenv.config()

export interface AppConfig {
	port: number
	mongoUri: string
	environment: 'development' | 'production'
	frontendUrl: string
}

export interface SecurityConfig {
	cors: CorsOptions
	helmet: HelmetOptions
	rateLimiting: {
		windowMs: number
		max: number
	}
}

const createAppConfig = (): AppConfig => {
	const config = {
		port: parseInt(process.env.PORT || '5001', 10),
		mongoUri:
			process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-telegram',
		environment:
			(process.env.NODE_ENV as 'development' | 'production') || 'development',
		frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
	}

	console.log('🔍 App Config loaded:')
	console.log('Port:', config.port)
	console.log('Environment:', config.environment)
	console.log('MongoDB URI:', config.mongoUri.substring(0, 20) + '...')
	console.log('Frontend URL:', config.frontendUrl)

	return config
}

export const appConfig = createAppConfig()

export const getSecurityConfig = (isDev: boolean): SecurityConfig => {
	console.log('🔒 Security Config:')
	console.log('CORS Origin:', appConfig.frontendUrl)
	console.log('Development mode:', isDev)

	return {
		cors: {
			origin: appConfig.frontendUrl,
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
			allowedHeaders: ['Content-Type', 'Authorization']
		},
		helmet: {
			contentSecurityPolicy: isDev ? false : undefined,
			crossOriginEmbedderPolicy: false
		},
		rateLimiting: {
			windowMs: 15 * 60 * 1000,
			max: isDev ? 1000 : 100
		}
	}
}
