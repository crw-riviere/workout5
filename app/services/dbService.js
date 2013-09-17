﻿wo5App.service('dbService', function (resourceService) {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    var self = this;

    self.programs = [];

    self.initDB = function () {
        try {
            if (!window.indexedDB) {
                window.alert("Your browser doesn't support IndexedDB. You will not be able to save your workout.");
            };

            var request = window.indexedDB.open(resourceService.consts.db.wo5, 1);

            request.onupgradeneeded = function (event) {
                console.info('Upgrading database.');
                var db = event.target.result;

                var productStore = db.createObjectStore(resourceService.consts.store.program, { keyPath: resourceService.consts.index.id, autoIncrement: true });
                productStore.createIndex(resourceService.consts.index.name, resourceService.consts.index.name, { unique: true });

                var exerciseStore = db.createObjectStore(resourceService.consts.store.exercise, { keyPath: resourceService.consts.index.id, autoIncrement: true });
                exerciseStore.createIndex(resourceService.consts.index.name, resourceService.consts.index.name, { unique: true });

                var sessionStore = db.createObjectStore(resourceService.consts.store.session, { keyPath: resourceService.consts.index.id, autoIncrement: true });
                sessionStore.createIndex(resourceService.consts.index.name, resourceService.consts.index.name, { unique: false });
                sessionStore.createIndex(resourceService.consts.index.workout, [resourceService.consts.index.program, resourceService.consts.index.day], { unique: false });

                var setStore = db.createObjectStore(resourceService.consts.store.set, { keyPath: resourceService.consts.index.id, autoIncrement: true });
                setStore.createIndex(resourceService.consts.index.name, resourceService.consts.index.name, { unique: false });
                setStore.createIndex(resourceService.consts.index.exercise, resourceService.consts.index.exercise, { unique: false });
                setStore.createIndex(resourceService.consts.index.session, resourceService.consts.index.session, { unique: false });
                setStore.createIndex(resourceService.consts.index.workout, [resourceService.consts.index.session, resourceService.consts.index.exercise], { unique: false });

            };

            request.onerror = function (event) {
                console.error('Failed to load database. Ex: ' + event.target.errorCode);
            }
            request.onsuccess = function (event) {
                console.info('Successfully loaded database.');
                resourceService.db = request.result;
            }
        } catch (ex) {
            console.error('Failed to load database. Ex: ' + ex.message);
        }
    };

    self.getStore = function (storeName, mode) {
        try {
            console.log('dbService rsc: ' + resourceService.db);
            console.log('dbService storeName: ' + storeName);
            var tx = resourceService.db.transaction(storeName, mode);
            return tx.objectStore(storeName);
        }
        catch (ex) {
            console.error('Failed to retrieve store. Ex: ' + ex.message);
            throw ex;
        }
    };

    self.getEntity = function (entityId, storeName, callback) {
        try {
            var store = self.getStore(storeName, resourceService.consts.op.rw);
            var request = store.get(entityId);

            request.onsuccess = function (event) {
                callback(event.target.result);
            }

            request.onerror = function (event) {
                console.error('Failed to retrieve ' + entityId + ' from ' + storeName + '. Ex: ' + event.target.errorCode);
            }
        }
        catch (ex) {
            console.error('Failed to retrieve ' + entityId + ' from ' + storeName + '. Ex: ' + ex.message);
        }
    }

    self.getEntityByIndex = function (indexName, indexValue, storeName, callback) {
        try {
            var store = self.getStore(storeName, resourceService.consts.op.rw);
            var index = store.index(indexName);

            var request = index.get(indexValue);

            request.onsuccess = function (event) {
                callback(event.target.result);
            }

            request.onerror = function (event) {
                console.error('Failed to retrieve ' + indexValue + '. Ex: ' + event.target.errorCode);
            }
        }
        catch (ex) {
            console.error('Failed to retrieve ' + indexValue + '. Ex: ' + ex.message);
        }
    }

    self.getEntities = function (storeName, callback) {
        try {
            var entityCollection = [];
            var store = self.getStore(storeName, resourceService.consts.op.rw);
            var request = store.openCursor();

            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var entity = cursor.value;
                    entityCollection.push(entity);
                    console.info('Retrieved ' + cursor.value.name + ' from ' + storeName + '.');
                    cursor.continue();
                }
                else {
                    callback(entityCollection);
                }
            }
        }
        catch (ex) {
            console.error('Failed to load entities from ' + storeName + '. Ex: ' + ex);
        }
    };

    self.getEntitiesByIndex = function (indexName, indexValue, storeName, callback) {
        try {
            var entityCollection = [];
            var range = IDBKeyRange.only(indexValue);
            var store = self.getStore(storeName, resourceService.consts.op.rw);
            var index = store.index(indexName);
            var request = index.openCursor(range);

            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var entity = cursor.value;
                    entityCollection.push(entity);
                    console.info('Retrieved ' + cursor.value.name + ' from ' + storeName + '.');
                    cursor.continue();
                }
                else {
                    callback(entityCollection);
                }
            }

            request.onerror = function (event) {
                console.error('Failed to retrieve ' + indexValue + '. Ex: ' + event.target.errorCode);
            }
        }
        catch (ex) {
            console.error('Failed to retrieve ' + indexValue + '. Ex: ' + ex.message);
        }
    };

    self.putEntity = function (entity, storeName, callback) {
        try {
            var store = self.getStore(storeName, resourceService.consts.op.rw);
            var request = store.put(entity);

            request.onsuccess = function (event) {
                event.target.transaction.objectStore(storeName).get(event.target.result).onsuccess = function (event) {
                    callback(event.target.result);
                }
            };

            request.onerror = function (event) {
                console.error('Failed to put entity: ' + entity + '. Ex: ' + event.target.errorCode);
            };
        }
        catch (ex) {
            console.error('Failed to put entity: ' + entity + '. Ex: ' + ex);
        }
    };

    self.removeEntity = function (entity, storeName, callback) {
        try {
            var store = self.getStore(storeName, resourceService.consts.op.rw);
            console.log('Deleting entity: ' + entity.id);
            var request = store.delete(entity.id);

            request.onsuccess = function (event) {
                console.log('Deleted entity: ' + entity);
                callback();
            }

            request.onerror = function (event) {
                console.error('Failed to delete entity: ' + entity + '. Ex: ' + event.target.errorCode);
            }
        }
        catch (ex) {
            console.error('Failed to delete entity: ' + entity + '. Ex: ' + ex.message);
        }
    }
});