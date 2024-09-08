# installProject.sh
#!/bin/bash

projectname=$1
if [ -z "$projectname" ]; then
  echo "Error: No project name supplied"
  exit 1
fi

cd src/projects/$projectname || exit
yarn && yarn build
# if projects does not exist, create it
mkdir -p ./../../../build/projects
# if build/$projectname exists, remove it
rm -rf ./../../../build/projects/$projectname
# if build/$projectname does not exist, create it
mkdir -p ./../../../build/projects/$projectname
cp -R build/* ./../../../build/projects/$projectname
