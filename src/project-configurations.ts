export interface Dependency {
  version: string;
  name: string;
  alias?: string;
  import: boolean;
  require?: boolean;
  windowImport?: boolean;
  windowAlias?: string;
  resolveExports?: boolean;
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
  title: string;
}

export interface ProjectConfigurations {
  templateDir: string;
  baseTemplateDir: string;
  tsTemplate: string;
  projects: ProjectConfiguration[];
}

export const projectConfigs: ProjectConfigurations = {
  templateDir: "./templates/",
  baseTemplateDir: "./templates/base",
  tsTemplate: "src/script-runner.ts",
  projects: [
    {
      name: "default",
      title: "Default",
      description: "Default project configuration. To use ethers v6 and zksync-ethers v6, use the respective configurations",
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
          version: "^1.1.3",
          name: "zokrates-js",
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
          version: "^5.10.0",
          import: true,
          windowImport: true,
        },
        {
          version: "^5.19.5",
          name: "starknet",
          import: true,
          windowImport: true,
          windowAlias: "_starknet"
        },
        {
          version: "0.7.0",
          name: "snarkjs",
          import: true,
          windowImport: false,
          require: true
        },
        {
          version: "^0.0.8",
          name: "circomlibjs",
          import: true,
          windowImport: true,
        }, {
          name: "ffjavascript",
          version: "^0.2.62",
          import: true,
          windowImport: true
        }, {
          name: "big-integer",
          version: "^1.6.48",
          import: false,
          windowImport: false
        }, {
          name: "@zk-kit/incremental-merkle-tree",
          version: "^1.1.0",
          import: true,
          windowImport: true,
          alias: "zkkitIncrementalMerkleTree"
        },
        {
          version: "0.0.1-alpha.27",
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
        }, {
          name: "@semaphore-protocol/group",
          version: "^3.11.0",
          import: true,
          windowImport: true,
          alias: "semaphoreProtocolGroup"
        }, {
          name: "@semaphore-protocol/identity",
          version: "^3.11.0",
          import: true,
          windowImport: true,
          alias: "semaphoreProtocolIdentity"
        }
        , {
          name: "@semaphore-protocol/proof",
          version: "^3.11.0",
          import: true,
          windowImport: true,
          alias: "semaphoreProtocolProof"
        }, {
          name: "crypto-js",
          version: "^4.2.0",
          import: true,
          windowImport: true,
        }, {
          name: "aes-js",
          version: "^3.1.2",
          import: true,
          windowImport: true,
        }, {
          name: "multihashes",
          version: "^4.0.3",
          import: true,
          windowImport: true,
        }, {
          name: "openai",
          version: "latest",
          import: true,
          windowImport: true
        }
      ],

      replacements: {
      },
    },
    {
      name: "zksyncv6",
      title: "ZkSync-ethers v6",
      description: "ZkSync v6 with Ethers v6",
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
          version: "1.5.3",
          name: "web3",
          import: false,
        },
        {
          name: "zksync-ethers",
          version: "^6",
          import: true,
          windowImport: true,
        }
      ],

      replacements: {
      },
    },
    {
      name: "ethers6",
      title: "Ethers 6",
      description: "A configuration with ethers v6",
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
          version: "1.5.3",
          name: "web3",
          import: false,
        }

      ],
      replacements: {
      },
    },
    {
      name: "starknet6.11",
      title: "starknet v6.11",
      description: "Starknet v6.11 project configuration.",
      publish: true,
      dependencies: [
        {
          version: "^5.19.5",
          name: "starknet",
          import: true,
          windowImport: true,
          windowAlias: "_starknet"
        }, {
          name: "crypto-js",
          version: "^4.2.0",
          import: true,
          windowImport: true,
        }, {
          name: "aes-js",
          version: "^3.1.2",
          import: true,
          windowImport: true,
        }
      ],
      replacements: {}
    },
    {
      name: "noir",
      title: "Noir",
      description: "A configuration with Noir",
      publish: true,
      dependencies: [
        {
          version: "1.0.0-beta.2",
          name: "@noir-lang/noir_wasm",
          import: true,
          windowImport: true
        }, {
          version: "1.0.0-beta.2",
          name: "@noir-lang/noir_js",
          import: true,
          windowImport: true
        },
        {
          version: "^0.82.3",
          name: "@aztec/bb.js",
          import: true,
          windowImport: true
        }
      ],
      replacements: {
      },
    }, {
      name: "chainlink",
      title: "Chainlink",
      description: "A configuration with Chainlink",
      publish: true,
      dependencies: [
        {
          version: "latest",
          name: "@chainlink/functions-toolkit",
          import: true,
          windowImport: true
        }, {
          version: "latest",
          name: "@chainlink/ccip-js",
          import: true,
          windowImport: true
        },
        {
          name: "viem",
          version: "2.31.0",
          import: true,
          windowImport: true,
          resolveExports: true,
          require: true
        },
        {
          version: "5.7.2",
          name: "ethers",
          alias: "ethersJS",
          import: true,
          windowImport: true,
        },
        {
          version: "1.5.3",
          name: "web3",
          import: false,
        }, {
          name: "net-browserify",
          version: "latest",
          import: false,
          windowImport: false
        }, {
          name: "dotenv",
          version: "16.4.7",
          import: true,
          require: true,
          windowImport: true
        }
      ],
      replacements: {}
    },{
      name: "circles-sdk",
      title: "Circles SDK",
      description: "A configuration with Circles SDK",
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
          version: "1.5.3",
          name: "web3",
          import: false,
        },{
          name: "@circles-sdk/sdk",
          version: "0.29.0",
          import: true,
          windowImport: true
        },{
          name: "@circles-sdk/pathfinder",
          version: "0.29.0",
          import: true,
          windowImport: true
        },{
          name: "@circles-sdk/adapter-ethers",
          version: "0.29.0",
          import: true,
          windowImport: true
        },{
          name: "@circles-sdk/utils",
          version: "0.29.0",
          import: true,
          windowImport: true
        },{
          name: "@circles-sdk/abi-v1",
          version: "0.29.0",
          import: true,
          windowImport: true
        },{
          name: "@circles-sdk/abi-v2",
          version: "0.29.0",
          import: true,
          windowImport: true
        },{
          name: "@circles-sdk/data",
          version: "0.29.0",
          import: true,
          windowImport: true
        },{
          name: "@circles-sdk/profiles",
          version: "0.29.0",
          import: true,
          windowImport: true
        },{
          name: "multihashes",
          version: "^4.0.3",
          import: true,
          windowImport: true,
        }
      ],
      replacements: {}
    },{
      name: "viem",
      title: "Viem",
      description: "A configuration with Viem",
      publish: true,
      dependencies: [
        {
          name: "viem",
          version: "2.31.0",
          import: true,
          windowImport: true,
          resolveExports: true,
          require: true
        }
      ],
      replacements: {}
    }
    // Add other projects here as needed
  ],
};
