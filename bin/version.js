#!/usr/bin/env node
/* eslint-disable */

const mri = require('mri');
const path = require('path');
const replace = require('replace');

const version = process.env.npm_package_version;
const package = process.env.npm_package_name;
const cwd = process.env.CWD;

const flags = mri(process.argv.slice(2), { alias: { help: ['h'] } });
const commands = flags._;

if (commands.length === 0 || (flags.help && commands.length === 0)) {
  console.log(`
    Usage: version [command] [options]
    Commands:
    print        Print the version
    amend        Amends the version to the built files
  `);
  process.exit(0);
}

const command = commands[0];

switch (command) {
  case 'print': {
    console.log(`Version for ${package} of release will be ${version}`);
    break;
  }
  case 'amend': {
    const distFolder = path.join(cwd, 'dist');
    const paths = [distFolder];

    replace({
      regex: '__VERSION_OF_RELEASE__',
      replacement: version,
      paths,
      recursive: true,
    });

    console.log(`Amended for ${package} for release ${version}`);
    break;
  }
  default:
    console.log(`Unknown script "${command}".`);
    break;
}
