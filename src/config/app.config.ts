import { CorsOptions } from 'cors'
import { HelmetOptions } from 'helmet'

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

export const getAppConfig = (): AppConfig => ({
	port: parseInt(process.env.PORT || '5001', 10),
	mongoUri:
		process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-telegram',
	environment:
		(process.env.NODE_ENV as 'development' | 'production') || 'development',
	frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
})

export const getSecurityConfig = (isDev: boolean): SecurityConfig => ({
	cors: {
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true
	},
	helmet: {
		contentSecurityPolicy: isDev ? false : undefined
	},
	rateLimiting: {
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100 // limit each IP to 100 requests per windowMs
	}
})
