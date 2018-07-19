import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';
import debounce from 'lodash/debounce';
import ejectionHandler from './ejectionHandler';
import logger from './logger';
import once from 'lodash/once';
import noop from 'lodash/noop';

const index = new Map();

const setupEject = once(function() {
	process.on('exit', ejectionHandler(index));
	process.on('SIGINT', ejectionHandler(index));
	process.on('uncaughtException', ejectionHandler(index));
});

export default function jsonCache(filename, config = {}) {
	if (!filename) throw new Error('node-json-cache: a json file is required');
	if (index.has(filename)) return index.get(filename);

	const {
		out = false,
		wait = 1000,
		ejectable = false,
	} = config;

	const log = logger({ enabled: out });

	// ensure our working directory
	fsExtra.ensureDirSync(path.dirname(filename));
	
	// create or retrieve a storage object
	let storage = fs.existsSync(filename) ?
		JSON.parse(fs.readFileSync(filename, { encoding: 'utf8' })) :
		{};

	// saving synchronously for ejection
	const save = () => fs.writeFileSync(filename, JSON.stringify(storage, null, 2));

	// saving asynchronously, for normal use
	const saveAsync = () => fs.writeFile(filename, JSON.stringify(storage, null, 2), noop);

	// store the save function for the instance to handle ejection
	ejectable && index.set(filename, save);
	ejectable && setupEject();
	
	// debounce write file
	const fileSync = debounce(saveAsync, wait);

	return {
		save,

		clear() {
			log('clear');
			storage = {};
			fileSync();
			return this;
		},

		get() {
			log('get');
			return storage;
		},

		set(data) {
			if (!data) throw new Error(`node-json-cache: missing data in "set": ${data}`);
			log('set', data);
			storage = data;
			fileSync();
			return data;
		},

		setItem(key, value) {
			if (!key) throw new Error(`node-json-cache: missing param "key" in setItem: ${key}`);
			log('setItem', key, value);
			storage[key.toString()] = value;
			fileSync();
			return value;
		},

		getItem(key) {
			if (!key) throw new Error(`node-json-cache: missing param "key" in getItem: ${key}`);
			log('getItem', key);
			return storage[key.toString()];
		},
	};
};