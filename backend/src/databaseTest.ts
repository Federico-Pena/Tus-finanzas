import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
export const dbTestConnect = async (): Promise<void> => {
  try {
    const mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri, { dbName: 'databaseTest' })
  } catch (error: any) {
    console.log(error.message)
  }
}
export const dbTestDisconnect = async (): Promise<void> => {
  const mongod = await MongoMemoryServer.create()
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}
