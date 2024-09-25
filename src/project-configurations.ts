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

export interface customScriptRunnerConfig {
  baseConfiguration: string;
  dependencies: Dependency[];
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
      name: "zksync",
      description: "ZkSync ethers template",
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
        {
          name: "zksync-ethers",
          version: "^5.7.2",
          import: true,
          windowImport: true,
        }
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
    {
      name: "zk",
      description: "snarkjs/circomlib template",
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
          version: "^0.7.0",
          name: "snarkjs",
          import: true,
          windowImport: true,
          require: true
        },
        {
          version: "^0.0.8",
          name: "circomlibjs",
          import: true,
          windowImport: true,
        },{
          name: "ffjavascript",
          version: "^0.2.62",
          import: true,
          windowImport: true
        },{
          name: "big-integer",
          version: "^1.6.48",
          import: false,
          windowImport: false
        },{
          name: "@zk-kit/incremental-merkle-tree",
          version: "^1.1.0",
          import: true,
          windowImport: true,
          alias: "zkkitIncrementalMerkleTree"
        },
        {
          version: "^0.0.1-alpha.27",
          name: "sindri",
          import: true,
          windowImport: true,
        },
        {
          name: "@semaphore-protocol/data",
          version: "^3.11.0",
          import: true,
          windowImport: true,
          alias: "semaphoreProtocolData"
        },{
          name: "@semaphore-protocol/group",
          version: "^3.11.0",
          import: true,
          windowImport: true,
          alias: "semaphoreProtocolGroup"
        },{
          name: "@semaphore-protocol/identity",
          version: "^3.11.0",
          import: true,
          windowImport: true,
          alias: "semaphoreProtocolIdentity"
        }
        ,{
          name: "@semaphore-protocol/proof",
          version: "^3.11.0",
          import: true,
          windowImport: true,
          alias: "semaphoreProtocolProof"
        }
      ],
      replacements: {
      },
    },
    {
      name: "ethers6",
      description: "ethers6 template",
      publish: true,
      dependencies: [
        {
          version: "^6",
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
      ],
      replacements: {
      },
    },
    // Add other projects here as needed
  ],
};
