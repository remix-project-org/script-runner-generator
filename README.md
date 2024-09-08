# Generator for script runners for use in Remix

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
      },
    },

```

- import: boolean // adds the import to the script-runner.ts
- 
