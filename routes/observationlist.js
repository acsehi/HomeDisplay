var azure = require('azure-storage');
var async = require('async');

module.exports = ObservationList;

function ObservationList(observation) {
    this.observation = observation;
}

ObservationList.prototype = {
    showObservations: function (req, res) {
        self = this;
        today = new Date();
        var dateString = today.format("yyyy-mm-dd");
        var q = 'RowKey gt \'';
        q = q.concat(dateString, '\'');

        var query = new azure.TableQuery().where(q, false);
        self.observation.find(query, function itemsFound(error, items) {
            items.reverse();
            res.render('temperature', { title: 'Temperature and humidity', observations: items, year: new Date().getFullYear(), message: 'Temp and humidity.' });
        });
    }
}