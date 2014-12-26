var azure = require('azure-storage');
var entityGen = azure.TableUtilities.entityGenerator;

module.exports = Observation;

function Observation(storageClient, tableName, partitionKey) {
    this.storageClient = storageClient;
    this.tableName = tableName;
    this.partitionKey = partitionKey;
    this.storageClient.createTableIfNotExists(tableName, function tableCreated(error) {
        if (error) {
            throw error;
        }
    });
};

Observation.prototype = {
    find: function (query, callback) {
        self = this;
        self.storageClient.queryEntities(this.tableName, query, null, function entitiesQueried(error, result) {
            if (error) {
                callback(error);
            } else {
                callback(null, result.entries);
            }
        });
    }
}