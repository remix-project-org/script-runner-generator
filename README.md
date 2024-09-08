# Generator for script runners for use in Remix


## general concepts


### projects 

A project is a custom script runner build that has certain imports added to it, like starknet or sindri. It contains node_modules you specify on top of the 'default' template. You can generate projects by adding them to a configuration file. 
/src/project-configurations.ts

### how it's published

there is one index with a little script that accpets a ?template= and then loads the script-runner that is required from a projects/ subdirectory

### templates

In the templates directory you will find a default template which is used for all projects.
It contains the minimal functionality of the script-runnner.

You do not need to create templates for each project if you are only adding depedencies to it like starknet or zokrates. Just add a project to the config to create it.

If you want custom templates you can override any file by putting it in its own template directory, ie
templates/ethers6/. There you need to add src files. If the generator doesn't find required files it will use those from the default template.
That way you can also override the webpackconfig or tsconfig if needed.

The projects are generated in the projects/ directory, this is not stored in git, they are temporary. It's a complete project ready to be bundled by webpack.
So any edits you do in the projects directory will be gone. You need to do it in the templates or the config if you want them to be permanent.

### Remix integration

Running builds will generate a json file containing the projects. Remix will load the file and render a toolbox to load the script-runner

## adding a project

project-configurations.ts contains an array of projects

```
   {
      name: "default",
      description: "Default project configuration using ethers 5",
      publish: true,
      dependencies: [
        {
          version: "^5",
          name: "ethers",
          alias: "ethersJS",
          import: true,
          windowImport: true,
        },
        {
          version: "^4",
          name: "multihashes",
          import: true,
          windowImport: true,
        },
        {
          version: "1.5.3",
          name: "web3",
          import: false,
        },
      ],

      replacements: {
        MY_BLOCK: 'myblock.ts'
      },
    },

```
- publish: Remix filters these, it won't show them it it's false
- import: boolean // adds the import to the script-runner.ts
- windowImport: boolean // means it will add window['multihashes'] = multihashes;
- alias, ie: import * as ethersJS from 'ethers';

replacements are meant to add custom block of code from a file, it will look for 
\\{MY_BLOCK} in the script-runner.ts
and replace it with the contents of myblocks.ts

## generating 

Generating means it will create TS files from the config and the templates.
After that they need to be build so when served they can be loaded

You can use yarn generate. You need to specify --projects= as an arg.
- ```yarn generate --projects=all``` to generate all projects
- ```yarn generate --projects=starknet``` to specify a project
- ```yarn generate --projects=all --build``` to generate all projects and buil
- ```yarn generate --projects=starknet --build``` to specify a project and build it
Use the flag --build to actually build the projects specified
ie --projects=all --build 
or --projects=default --build

## building 

Building means it runs webpack to create a script-runner.js. It's not the generator.
If you want to experiment with the generated files you can use the build to test your builds and then adapt the template.

run: yarn build:project customproject
this builds a script-runner.js and puts it in build/projects/customeproject

or you can use the --build flag on the generator


## serving

run yarn serve to serve the script-runner
internally the script-runner accepts ?template=thename
to load a specific project into the frame
ie http://localhost:3000/?template=zokrates




