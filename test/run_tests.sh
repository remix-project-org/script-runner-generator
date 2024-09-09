#!/usr/bin/env bash

set -e

# Default TEST_EXITCODE
TEST_EXITCODE=0

# Flag for --local argument
IS_LOCAL=false
TEST_NAME=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        --local)
        IS_LOCAL=true
        echo "Running in local mode, skipping 'yarn serve_remix_live'"
        shift # move to the next argument
        ;;
        --test)
        TEST_NAME="$2"
        echo "Running specific test: $TEST_NAME"
        shift # move past the --test argument
        shift # move to the next argument (the test name)
        ;;
        *)
        echo "Unknown option $key"
        shift # move to the next argument
        ;;
    esac
done

# Start necessary services
npx ganache &
yarn serve_script_runner &
if [ "$IS_LOCAL" = false ]; then
    yarn serve_remix_live &
fi
sleep 10

# Run tests
if [ -n "$TEST_NAME" ]; then
    echo "Running specific test: $TEST_NAME"
    yarn build:e2e && yarn nightwatch --test $TEST_NAME --config dist/nightwatch.js || TEST_EXITCODE=1
else
    echo "Running all tests"
    yarn build:e2e && yarn nightwatch --config dist/nightwatch.js || TEST_EXITCODE=1
fi

# Output the exit code
echo "$TEST_EXITCODE"

# Handle exit code
if [ "$TEST_EXITCODE" -eq 1 ]; then
  exit 1
fi
