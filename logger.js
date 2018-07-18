import noop from 'lodash/noop';

export default function logger(config = {}) {
	if (config.enabled === false) return noop;
	return function log(...args) {
		console.log.apply(['node-json-cache: ', ...args]);
	};
};