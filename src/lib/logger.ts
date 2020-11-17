import chalk from 'chalk';

export default class log {
  static br(): void {
    console.log('');
  }

  static info(msg: string): void {
    console.log(chalk.white(msg));
  }

  static warn(msg: string): void {
    console.log(`${chalk.yellow('Warning!')} ${chalk.white(msg)}`);
  }

  static err(msg: string): void {
    const ERROR_EXIT = 4;

    console.log(`${chalk.red('Error!')} ${chalk.white(msg)}`);
    process.exit(ERROR_EXIT);
  }
}