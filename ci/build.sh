#!/bin/bash

set -e
npx ts-node src/getProjects.ts | sort | circleci tests split