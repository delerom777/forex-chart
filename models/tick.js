var mongoose = require('mongoose');

var TickSchema = mongoose.Schema({
    date: { type: String, default: Date.now },
    bid: Number,
    ask: Number,
    clsbid: Number,
    clsask: Number,
    name: String
},{ 
    timestamps: { createdAt: 'created_at' } 
});

module.exports = mongoose.model("Tick", TickSchema);
