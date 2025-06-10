import mongoose from 'mongoose'

export const connectDB = async (uri: string): Promise<void> => {
	try {
		console.log('🔄 Connecting to MongoDB...')
		console.log(`📍 URI: ${uri}`)

		await mongoose.connect(uri)

		console.log('✅ MongoDB connected successfully')

		// Log database name
		const dbName = mongoose.connection.db?.databaseName
		console.log(`📊 Database: ${dbName}`)
	} catch (error) {
		console.error('❌ MongoDB connection error:', error)
		throw error
	}
}

// Graceful shutdown
process.on('SIGINT', async () => {
	try {
		await mongoose.connection.close()
		console.log('📴 MongoDB connection closed.')
		process.exit(0)
	} catch (error) {
		console.error('❌ Error during MongoDB disconnection:', error)
		process.exit(1)
	}
})

// Connection event listeners
mongoose.connection.on('connected', () => {
	console.log('🟢 Mongoose connected to MongoDB')
})

mongoose.connection.on('error', err => {
	console.error('🔴 Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
	console.log('🟡 Mongoose disconnected')
})
