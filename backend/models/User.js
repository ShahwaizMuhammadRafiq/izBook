const { default: mongoose } = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true // Uncommented this
    },
    email: {
        type: String,
        required: true // Uncommented this
    },
    password: {
        type: String,
        required: true // Uncommented this
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('user', UserSchema);
module.exports = User;