// Import required modules
import * as fs from 'fs';
import * as yaml from 'yaml';
import { execSync } from 'child_process';
import * as path from 'path';

// Define the paths for the YAML file and the output TypeScript file
const yamlFilePath: string = './dependencies.yml';

// Define the interface for the parsed YAML structure
interface ParsedYaml {
  name: string;
  dependencies: { [key: string]: string };
  tsTemplate: string;  // This is now a file path
  customCode: string;
}

// Read the YAML file
const fileContent: string = fs.readFileSync(yamlFilePath, 'utf8');

// Parse the YAML content
const parsedYaml: ParsedYaml = yaml.parse(fileContent);

// Extract name, dependencies, TypeScript template path, and custom code from parsed YAML
const { name, dependencies, tsTemplate, customCode } = parsedYaml;

// Set up the project directory
const projectDir = path.join(__dirname, name);

// Ensure the project directory is clean by creating it if it doesn't exist
if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir);
} else {
  console.log(`Directory ${projectDir} already exists. Please use a different project name or clean up the folder.`);
  process.exit(1);  // Exit if the folder already exists to avoid overwriting
}

// Read the TypeScript template file
const templateContent: string = fs.readFileSync(tsTemplate, 'utf8');

// Create the package.json content
const packageJson = {
  name: name || "default-project-name",
  version: "1.0.0",
  main: "index.js",
  license: "MIT",
  dependencies: dependencies
};

// Write the package.json to the project directory
const packageJsonPath = path.join(projectDir, 'package.json');
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Generate TypeScript import statements
let tsImports: string = '';
Object.keys(dependencies).forEach(dep => {
  tsImports += `import * as ${dep.replace(/[^a-zA-Z0-9]/g, '_')} from '${dep}';\n`;
});

// Replace the placeholder in the template with the custom code
const finalTsContent = templateContent.replace('/* CUSTOM_CODE_PLACEHOLDER */', customCode);

// Combine imports and the template with custom code
const fullTsContent = `${tsImports}\n${finalTsContent}`;

// Write the generated TypeScript content to the project directory
const outputTsFilePath = path.join(projectDir, 'generatedImports.ts');
fs.writeFileSync(outputTsFilePath, fullTsContent);

// Change directory to the project folder and run yarn to install dependencies
console.log(`Installing dependencies in ${projectDir}...`);
execSync('yarn install', { cwd: projectDir, stdio: 'inherit' });

console.log(`Project ${name} has been created and dependencies installed.`);
console.log(`Generated TypeScript file at ${outputTsFilePath}`);
