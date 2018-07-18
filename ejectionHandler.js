import chalk from 'chalk';
import logger from './logger';

const log = logger();

export default function ejectionHandler(map) {
	return function handleEjection() {
		log(chalk.yellow('ejecting'));
		map.forEach(handler => handler());
		log(chalk.green('saved'));
	};
};