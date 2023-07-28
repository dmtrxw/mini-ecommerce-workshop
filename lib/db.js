const { AsyncDatabase } = require('promised-sqlite3')

async function dbConnect() {
    const db = await AsyncDatabase.open('./ecommerce.db')
    return db
}

module.exports = {
    dbConnect,
}
