#!/usr/bin/env bash

set -e

BUILD_ID=${CIRCLE_BUILD_NUM:-${TRAVIS_JOB_NUMBER}}
echo "$BUILD_ID"
TEST_EXITCODE=0
yarn &
yarn ganache &
yarn serve_script_runner &
yarn serve_remix_live &
sleep 10
yarn build:e2e
TESTFILES=$(find ./dist/tests -type f -name '*.js' ! -exec grep -q "'@disabled': \?true" {} \; -print | sort | circleci tests split --split-by=timings)
for TESTFILE in $TESTFILES; do
    yarn nightwatch --test $TESTFILE --config dist/nightwatch.js  || TEST_EXITCODE=1
done

echo "$TEST_EXITCODE"
if [ "$TEST_EXITCODE" -eq 1 ]
then
  exit 1
fi
