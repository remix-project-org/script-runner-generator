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
    description: string;
    dependencies: Dependency[];
    templateDir: string;
    defaultTemplateDir: string;
    tsTemplate: string;
    replacements: Replacements;
  }
  
  export interface ProjectConfigurations {
    projects: ProjectConfiguration[];
  }
  
  export const projectConfigs: ProjectConfigurations = {
    projects: [
      {
        name: "default",
        description: "Default project configuration using ethers 5",
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
            version: "^1.5.0",
            name: "web3",
            import: false,
          },
        ],
        templateDir: "./templates/",
        defaultTemplateDir: "./templates/default",
        tsTemplate: "src/script-runner.ts",
        replacements: {
        },
      },
      {
        name: "zokrates",
        description: "zokrates template",
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
            version: "^1.5.0",
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
        templateDir: "./templates/",
        defaultTemplateDir: "./templates/default",
        tsTemplate: "src/script-runner.ts",
        replacements: {
        },
      },
      {
        name: "starknet",
        description: "snarknet template",
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
            version: "^1.5.0",
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
        templateDir: "./templates/",
        defaultTemplateDir: "./templates/default",
        tsTemplate: "src/script-runner.ts",
        replacements: {
        },
      },
      // Add other projects here as needed
    ],
  };
  