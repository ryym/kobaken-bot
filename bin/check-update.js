#!/usr/bin/env node

const { run } = require('../src')

require('dotenv').config()

run(process.env)
