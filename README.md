# node-json-cache

Use a json file as a cache.

## Usage

```js
import jsonCache from 'node-json-cache';

cache = jsonCache('.cache/filetocache.json');
// set an item
cache.setItem('key', 'value'); // 'value'
// get an item
cache.getItem('key'); // 'value'
// gets entire cache
cache.get(); // { key: 'value' }
// overwrite cache
cache.set({ hello: 'world' }); // { hello: 'world' }
// synchronously saves the cache
cache.save();
// clears the cache
cache.clear();
```

## Options

```js
const cache = jsonCache(filename[, options]);
```
- `filename` - path to cache file
- `options` - optional
* `out` - optional, output operations to console, defaults to `false`
* `wait` - optional, debounce time on operations, defaults to `1000`
* `ejectable` - optional, save on exit/error, defaults to `true`

## filesystem perfomance
Storage operations are batched. Storage is persisted on exit.

## See also

Inspired by [Node LocalCache(https://github.com/glebmachine/node-localcache), With notable changes:
* explicity operate with a file, no `skipFileCachig`
* allow setting of `undefined` as a value
* allow getting and setting of the entire file
* async file saving by default
* more settings