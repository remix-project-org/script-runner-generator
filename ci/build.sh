#!/bin/bash

set -e
BUILDS=$(npx ts-node src/getProjects.ts | sort | circleci tests split)
for BUILD in $BUILDS; do
    yarn generate --projects=$BUILD --build
done