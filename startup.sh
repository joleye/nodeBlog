#!/bin/bash

#nohup node app.js > nohup.out &
nohup supervisor app.js > nohup.out &
