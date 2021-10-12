#!/usr/bin/env node

require('dotenv').config();
require('yargs/yargs')(process.argv.slice(2))
  .commandDir('./cmds')
  .demandCommand()
  .help()
  .argv;
