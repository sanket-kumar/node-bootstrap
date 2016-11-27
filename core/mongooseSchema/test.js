/**
 * Created by Sanket on 11/28/16.
 */
var mongoose        = require('../../helpers/mongoConnector');
var Schema          = mongoose.Schema;
var autoIncrement   = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var testSchema = new Schema({
    id          : { type : Number, required: true},
    message     : { type : String, required: true}
});

// the schema is useless so far
// we need to create a model using it
testSchema.plugin(autoIncrement.plugin, { model: 'test', field: 'id', startAt: 1 });
var test = mongoose.connection.model('test', testSchema);

// make this available to users in our Node applications
module.exports = test;