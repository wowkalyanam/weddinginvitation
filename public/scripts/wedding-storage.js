/**
 * Wow Kalyanam Photo & Wedding Customization Storage
 * Uses IndexedDB (unlimited quota) + SessionStorage + LocalStorage
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WowWeddingStorage = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DB_NAME = 'wow_wedding_db';
  var DB_VERSION = 1;
  var STORE_NAME = 'photos';

  function openDB() {
    return new Promise(function (resolve, reject) {
      if (typeof indexedDB === 'undefined') {
        return resolve(null);
      }
      try {
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function (e) {
          var db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = function (e) {
          resolve(e.target.result);
        };
        req.onerror = function () {
          resolve(null);
        };
      } catch (err) {
        resolve(null);
      }
    });
  }

  function savePhotos(templateId, photos) {
    return new Promise(function (resolve) {
      if (!Array.isArray(photos) || photos.length === 0) {
        return resolve(false);
      }

      // 1. Save to sessionStorage
      try {
        sessionStorage.setItem('wow_photos_' + templateId, JSON.stringify(photos));
        sessionStorage.setItem('wow_photos_latest', JSON.stringify(photos));
      } catch (_) {}

      // 2. Save to localStorage if possible
      try {
        localStorage.setItem('wow_photos_' + templateId, JSON.stringify(photos));
        localStorage.setItem('wow_photos_latest', JSON.stringify(photos));
      } catch (_) {}

      // 3. Save to IndexedDB (unlimited storage quota)
      openDB().then(function (db) {
        if (!db) return resolve(true);
        try {
          var tx = db.transaction(STORE_NAME, 'readwrite');
          var store = tx.objectStore(STORE_NAME);
          store.put(photos, 'template_' + templateId);
          store.put(photos, 'latest');
          tx.oncomplete = function () {
            resolve(true);
          };
          tx.onerror = function () {
            resolve(true);
          };
        } catch (_) {
          resolve(true);
        }
      });
    });
  }

  function getPhotos(templateId) {
    return new Promise(function (resolve) {
      // 1. Check sessionStorage
      try {
        var s = sessionStorage.getItem('wow_photos_' + templateId) || sessionStorage.getItem('wow_photos_latest');
        if (s) {
          var parsed = JSON.parse(s);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return resolve(parsed);
          }
        }
      } catch (_) {}

      // 2. Check localStorage
      try {
        var l = localStorage.getItem('wow_photos_' + templateId) || localStorage.getItem('wow_photos_latest');
        if (l) {
          var parsedL = JSON.parse(l);
          if (Array.isArray(parsedL) && parsedL.length > 0) {
            return resolve(parsedL);
          }
        }
      } catch (_) {}

      // 3. Check IndexedDB
      openDB().then(function (db) {
        if (!db) return resolve(null);
        try {
          var tx = db.transaction(STORE_NAME, 'readonly');
          var store = tx.objectStore(STORE_NAME);
          var getReq = store.get('template_' + templateId);
          getReq.onsuccess = function () {
            if (getReq.result && Array.isArray(getReq.result) && getReq.result.length > 0) {
              resolve(getReq.result);
            } else {
              var getLatest = store.get('latest');
              getLatest.onsuccess = function () {
                resolve(getLatest.result || null);
              };
              getLatest.onerror = function () {
                resolve(null);
              };
            }
          };
          getReq.onerror = function () {
            resolve(null);
          };
        } catch (_) {
          resolve(null);
        }
      });
    });
  }

  return {
    savePhotos: savePhotos,
    getPhotos: getPhotos
  };
});
