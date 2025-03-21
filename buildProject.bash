#!/bin/bash

projectname=$1
if [ -z "$projectname" ]; then
  echo "Error: No project name supplied"
  exit 1
fi

cd src/projects/$projectname || { echo "Error: Could not change directory to src/projects/$projectname"; exit 1; }

# Run yarn and capture output in case of failure
if ! yarn; then
  exit 1
fi

# Run yarn build and capture output in case of failure
output=$(yarn build 2>&1)
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "Error: yarn build failed for project $projectname"
  echo "Yarn build error output:"
  echo "$output"
  exit $exit_code
fi

# if projects directory does not exist, create it
mkdir -p ./../../../build/projects

# if build/$projectname exists, remove it
rm -rf ./../../../build/projects/$projectname

# if build/$projectname does not exist, create it
mkdir -p ./../../../build/projects/$projectname

# copy the build output to the desired location
cp -R build/* ./../../../build/projects/$projectname