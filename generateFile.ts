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

// Helper function to deep merge objects (like merging package.json contents)
const deepMerge = (target: any, source: any): any => {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return { ...target, ...source };
};

// Helper function to recursively copy directories and files
const copyRecursiveSync = (src: string, dest: string) => {
  if (fs.existsSync(src)) {
    const stats = fs.statSync(src);
    const isDirectory = stats.isDirectory();
    if (isDirectory) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
      fs.readdirSync(src).forEach((file) => {
        const currentSrc = path.join(src, file);
        const currentDest = path.join(dest, file);
        copyRecursiveSync(currentSrc, currentDest);
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
};

// Read the YAML file
const fileContent: string = fs.readFileSync(yamlFilePath, 'utf8');

// Parse the YAML content
const parsedYaml: ParsedYaml = yaml.parse(fileContent);

// Helper function to check if a project-specific file exists in the project's subdirectory of templateDir
const getFilePath = (projectName: string, templateDir: string | undefined, defaultTemplateDir: string, fileName: string): string => {
  if (templateDir) {
    // Check for project-specific file first (e.g., templates/custom/project-one/customCode.ts)
    const projectSpecificPath = path.join(templateDir, projectName, fileName);
    if (fs.existsSync(projectSpecificPath)) {
      return projectSpecificPath;
    }

    // Fallback to templateDir without project subdirectory (generic file in custom templateDir)
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

// Function to copy only files from the `files` subdirectory of the template directories
const copyTemplateFiles = (src: string, projectName: string, templateDir: string | undefined, defaultTemplateDir: string, projectDir: string) => {
  // Project-specific files directory
  if (templateDir) {
    const projectSpecificFilesDir = path.join(templateDir, projectName, src);
    if (fs.existsSync(projectSpecificFilesDir)) {
      copyRecursiveSync(projectSpecificFilesDir, projectDir);
    }

    // Generic files directory within templateDir
    const genericFilesDir = path.join(templateDir, src);
    if (fs.existsSync(genericFilesDir)) {
      copyRecursiveSync(genericFilesDir, projectDir);
    }
  }

  // Default files directory within defaultTemplateDir
  const defaultFilesDir = path.join(defaultTemplateDir, src);
  if (fs.existsSync(defaultFilesDir)) {
    copyRecursiveSync(defaultFilesDir, projectDir);
  }
};

// Loop over each project in the YAML
parsedYaml.projects.forEach(project => {
  const { name, dependencies, templateDir, defaultTemplateDir, tsTemplate, replacements } = project;

  // Set up the project directory inside the "projects" subdirectory
  const projectDir = path.join(__dirname, 'projects', name);

  // If the project directory exists, delete it
  if (fs.existsSync(projectDir)) {
    console.log(`Directory ${projectDir} already exists. Deleting it...`);
    fs.rmSync(projectDir, { recursive: true, force: true });
  }

  // Create a fresh project directory
  fs.mkdirSync(projectDir, { recursive: true });

  // Construct the full path to the TypeScript template file (use project-specific or default template)
  const tsTemplatePath = getFilePath(name, templateDir, defaultTemplateDir, tsTemplate);

  // Read the TypeScript template file
  const templateContent: string = fs.readFileSync(tsTemplatePath, 'utf8');

  // Perform the replacements in the template
  const finalTsContent = performReplacements(templateContent, replacements, name, templateDir, defaultTemplateDir);

  // Read the default package.json template
  const defaultPackageJsonPath = path.join(defaultTemplateDir, 'defaultPackage.json');
  const defaultPackageJson = JSON.parse(fs.readFileSync(defaultPackageJsonPath, 'utf8'));

  // Create the project-specific package.json content
  const projectPackageJson = {
    name: name || "default-project-name",
    dependencies: dependencies
  };

  // Merge the default package.json with the project-specific content
  const mergedPackageJson = deepMerge(defaultPackageJson, projectPackageJson);

  // Write the merged package.json to the project directory
  const packageJsonPath = path.join(projectDir, 'package.json');
  fs.writeFileSync(packageJsonPath, JSON.stringify(mergedPackageJson, null, 2));

  // Generate TypeScript import statements
  let tsImports: string = '';
  Object.keys(dependencies).forEach(dep => {
    tsImports += `import * as ${dep.replace(/[^a-zA-Z0-9]/g, '_')} from '${dep}';\n`;
  });

  // Combine imports and the processed template content
  const fullTsContent = `${tsImports}\n${finalTsContent}`;

  // create src directory
  const srcDir = path.join(projectDir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

  // Write the generated TypeScript content to the project directory
  const outputTsFilePath = path.join(projectDir, 'src', 'script-runner.ts');
  fs.writeFileSync(outputTsFilePath, fullTsContent);

  // Copy only files from the `files` subdirectory of both the template and default template directories
  const filesDir = path.join(projectDir, 'src')
  copyTemplateFiles('files', name, templateDir, defaultTemplateDir, filesDir);

  // Copy only files from the `config` subdirectory of both the template and default template directories
  const configDir = projectDir
  copyTemplateFiles('config', name, templateDir, defaultTemplateDir, configDir);

  // Change directory to the project folder and run yarn to install dependencies
  console.log(`Installing dependencies in ${projectDir}...`);
  execSync('yarn install', { cwd: projectDir, stdio: 'inherit' });

  console.log(`Project ${name} has been created in ${projectDir} and dependencies installed.`);
  console.log(`Generated TypeScript file at ${outputTsFilePath}`);

  // copy index.html from root to build
  const indexHtmlPath = path.join(__dirname, 'index.html');
  const buildIndexHtmlPath = path.join('build', 'index.html');
  fs.copyFileSync(indexHtmlPath, buildIndexHtmlPath);
  console.log(`Copied index.html to ${buildIndexHtmlPath}`);


});
