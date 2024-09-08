export interface Dependency {
    version: string;
    name: string;
    alias?: string;
    import: boolean;
    require?: boolean;
    windowImport?: boolean;
  }
  
  export interface Replacements {
    [key: string]: string;
  }
  
  export interface ProjectConfiguration {
    name: string;
    publish: boolean;
    description: string;
    dependencies: Dependency[];
    replacements: Replacements;
  }
  
  export interface ProjectConfigurations {
    templateDir: string;
    defaultTemplateDir: string;
    tsTemplate: string;
    projects: ProjectConfiguration[];
  }
  
  export const projectConfigs: ProjectConfigurations = {
    templateDir: "./templates/",
    defaultTemplateDir: "./templates/default",
    tsTemplate: "src/script-runner.ts",
    projects: [
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
      {
        name: "zokrates",
        description: "zokrates template",
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
            version: "^1.5.3",
            name: "web3",
            import: false,
          },
          {
            version: "^1.1.3",
            name: "zokrates-js",
            import: true,
            windowImport: true,
          },
        ],
        replacements: {
        },
      },
      {
        name: "starknet",
        description: "snarknet template",
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
            version: "^1.5.3",
            name: "web3",
            import: false,
          },
          {
            version: "^5.19.5",
            name: "starknet",
            import: true,
            windowImport: true,
          },
        ],
        replacements: {
        },
      },
      // Add other projects here as needed
    ],
  };
  