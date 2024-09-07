# installProject.sh
#!/bin/bash

projectname=$1
if [ -z "$projectname" ]; then
  echo "Error: No project name supplied"
  exit 1
fi

cd src/projects/$projectname || exit
yarn
