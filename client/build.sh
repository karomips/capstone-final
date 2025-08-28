#!/bin/bash
chmod +x node_modules/.bin/*
CI=false npx react-scripts build
