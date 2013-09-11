wo5App.service('dbService', function () {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    var self = this;

    var consts = {
        db: { wo5: 'WO5' },
        op: {
            rw: 'readwrite'
        },
        store: {
            program: 'Program',
            exercise: 'Exercise',
            session: 'Session',
            set: 'Set'
        },
        index: {
            id: 'id',
            name: 'name',
            exercise: 'exercise',
            weight: 'weight'
        }
    }

    self.programs = [];

    self.initDB = function () {
        try {
            if (!window.indexedDB) {
                window.alert("Your browser doesn't support IndexedDB. You will not be able to save your workout.");
            };

            var request = window.indexedDB.open(consts.db.wo5, 3);

            request.onupgradeneeded = function (event) {
                console.info('Upgrading database.');
                var db = event.target.result;

                var productStore = db.createObjectStore(consts.store.program, { keyPath: consts.index.id, autoIncrement: true });
                productStore.createIndex(consts.index.name, consts.index.name, { unique: false });

                var exerciseStore = db.createObjectStore(consts.store.exercise, { keyPath: consts.index.id, autoIncrement: true });
                exerciseStore.createIndex(consts.index.name, consts.index.name, { unique: false });

                var sessionStore = db.createObjectStore(consts.store.session, { keyPath: consts.index.id, autoIncrement: true });
                sessionStore.createIndex(consts.index.name, consts.index.name, { unique: false });
                sessionStore.createIndex(consts.index.exercise, consts.index.exercise, { unique: false });

                var setStore = db.createObjectStore(consts.store.set, { keyPath: consts.index.id, autoIncrement: true });
                setStore.createIndex(consts.index.name, consts.index.name, { unique: false });
                setStore.createIndex(consts.index.exercise, consts.index.exercise, { unique: false });
                setStore.createIndex(consts.index.weight, consts.index.weight, { unique: false });
            };

            request.onerror = function (event) {
                console.error('Failed to load database. Ex: ' + event.target.errorCode);
            }
            request.onsuccess = function (event) {
                console.info('Successfully loaded database.');
                window.db = request.result;
                self.getEntities(consts.store.program, self.programs);
                //self.getEntities(consts.store.exercise, exercises);
                //self.getEntities(consts.store.sesssion, sessions);
                //self.getEntities(consts.store.set, sets);
            }
        } catch (ex) {
            console.error('Failed to load database. Ex: ' + ex.message);
        }
    };

    self.getStore = function (storeName, mode) {
        console.log('Retrieving store: ' + storeName + '. Operation: ' + mode + '. db: ' + db + '.');
        var tx = window.db.transaction(storeName, mode);
        return tx.objectStore(storeName);
    };

    self.getEntity = function (index, indexName, storeName) {
        try {
            var store = getStore(storeName, consts.op.rw);
            var index = store.index(indexName);

            var request = index.get(index);

            request.onsuccess = function (event) {
                return event.target.result;
            }

            request.onerror = function (event) {
                console.error('Failed to retrieve ' + index + '. Ex: ' + event.target.errorCode);
            }
        }
        catch (ex) {
            console.error('Failed to retrieve ' + index + '. Ex: ' + ex.message);
        }
    }

    self.getEntities = function (storeName, model) {
        try {
            var entityCollection = [];
            var store = self.getStore(storeName, consts.op.rw);
            var request = store.openCursor();

            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var entity = cursor.value;
                    model.push(entity);
                    console.info('Retrieved ' + cursor.value.name + ' from ' + storeName + '.');
                    cursor.continue();
                }
                else {
                    
                }
            }
        }
        catch (ex) {
            console.error('Failed to load entities from ' + storeName + '. Ex: ' + ex);
        }
    };

    self.putEntity = function (entity, storeName, callback) {
        try {
            var store = self.getStore(storeName, consts.op.rw);
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
            var store = self.getStore(storeName, consts.op.rw);
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