if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://huyng:huyatu@ds237707.mlab.com:37707/vidjot-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}