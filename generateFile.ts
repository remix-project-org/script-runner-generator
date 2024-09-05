// Import required modules
import * as fs from 'fs';
import * as yaml from 'yaml';
import { execSync } from 'child_process';
import * as path from 'path';

// Define the paths for the YAML file
const yamlFilePath: string = './projects.yml';

// Define the interface for the parsed YAML structure
interface Project {
  name: string;
  dependencies: { [key: string]: string };
  templateDir?: string;  // Optional directory containing project-specific template files
  defaultTemplateDir: string;  // Default directory containing common template files
  tsTemplate: string;   // Template file name (inside templateDir or defaultTemplateDir)
  replacements: { [placeholder: string]: string };  // Mapping of placeholders to file paths
}

interface ParsedYaml {
  projects: Project[];
}

// Read the YAML file
const fileContent: string = fs.readFileSync(yamlFilePath, 'utf8');

// Parse the YAML content
const parsedYaml: ParsedYaml = yaml.parse(fileContent);

// Helper function to check if a project-specific file exists, then fallback to project-independent, then default
const getFilePath = (projectName: string, templateDir: string | undefined, defaultTemplateDir: string, fileName: string): string => {
  if (templateDir) {
    // Check for project-specific file first (e.g., project-one-customCode.ts)
    const projectSpecificPath = path.join(templateDir, `${projectName}-${fileName}`);
    if (fs.existsSync(projectSpecificPath)) {
      return projectSpecificPath;
    }
    
    // Fallback to project-independent file (e.g., customCode.ts)
    const projectIndependentPath = path.join(templateDir, fileName);
    if (fs.existsSync(projectIndependentPath)) {
      return projectIndependentPath;
    }
  }
  // Fall back to default template directory if file is not found in the project-specific directory
  return path.join(defaultTemplateDir, fileName);
};

// Function to perform replacements in the template
const performReplacements = (
  template: string,
  replacements: { [placeholder: string]: string },
  projectName: string,
  templateDir: string | undefined,
  defaultTemplateDir: string
): string => {
  let updatedTemplate = template;

  // Iterate through each placeholder and its corresponding file
  Object.entries(replacements).forEach(([placeholder, fileName]) => {
    // Get the full path to the replacement file (use project-specific or default template)
    const filePath = getFilePath(projectName, templateDir, defaultTemplateDir, fileName);
    
    // Read the content of the file that corresponds to the placeholder
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Replace the placeholder in the template with the file content
    updatedTemplate = updatedTemplate.replace(new RegExp(`{{${placeholder}}}`, 'g'), fileContent);
  });

  return updatedTemplate;
};

// Loop over each project in the YAML
parsedYaml.projects.forEach(project => {
  const { name, dependencies, templateDir, defaultTemplateDir, tsTemplate, replacements } = project;

  // Set up the project directory inside the "projects" subdirectory
  const projectDir = path.join(__dirname, 'projects', name);

  // Ensure the project directory is clean by creating it if it doesn't exist
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  } else {
    console.log(`Directory ${projectDir} already exists. Please use a different project name or clean up the folder.`);
    return;  // Skip to the next project if the folder exists
  }

  // Construct the full path to the TypeScript template file (use project-specific or default template)
  const tsTemplatePath = getFilePath(name, templateDir, defaultTemplateDir, tsTemplate);

  // Read the TypeScript template file
  const templateContent: string = fs.readFileSync(tsTemplatePath, 'utf8');

  // Perform the replacements in the template
  const finalTsContent = performReplacements(templateContent, replacements, name, templateDir, defaultTemplateDir);

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

  // Combine imports and the processed template content
  const fullTsContent = `${tsImports}\n${finalTsContent}`;

  // Write the generated TypeScript content to the project directory
  const outputTsFilePath = path.join(projectDir, 'generatedImports.ts');
  fs.writeFileSync(outputTsFilePath, fullTsContent);

  // Change directory to the project folder and run yarn to install dependencies
  console.log(`Installing dependencies in ${projectDir}...`);
  execSync('yarn install', { cwd: projectDir, stdio: 'inherit' });

  console.log(`Project ${name} has been created in ${projectDir} and dependencies installed.`);
  console.log(`Generated TypeScript file at ${outputTsFilePath}`);
});
