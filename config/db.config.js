if (process.env.NODE_ENV === 'production') {
    module.exports = {
        HOST: process.env.HOST,
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DB: process.env.DB,
        DIALECT: process.env.DIALECT
    };
} else {
    module.exports = require('./db.dev.config')

}

