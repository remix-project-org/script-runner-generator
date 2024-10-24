#!/bin/bash

set -e
SHA=$(git rev-parse --short --verify main)
echo $SHA >> build/SHA
rm -rf projects
cp -R build/* .
git config user.email "filip.mertens@ethereum.org"
git config user.name "bunsenstraat"
git add .
git commit -m "Built website from {$SHA}."
git push -f origin gh-pages
find .
git log
git checkout main

