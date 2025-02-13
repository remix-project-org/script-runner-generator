// Import required modules
import * as fs from 'fs';
import { execSync } from 'child_process';
import * as path from 'path';
import { projectConfigs, ProjectConfiguration, Dependency } from './project-configurations'; // Import the project configurations
import { exit } from 'process';

interface ExecSyncError extends Error {
  stderr: Buffer;
  stdout: Buffer;
}
// Get the arguments from process.argv (ignoring the first two: 'node' and script name)
const args = process.argv.slice(2);
const buildProjectArg = args.find(arg => arg.startsWith('--build'));
// Function to parse --projects argument or --all flag
function parseProjectsArgument() {
  const allFlag = args.includes('--all');
  const projectsArg = args.find(arg => arg.startsWith('--projects='));

  // If --all is passed, return a placeholder for all projects
  if (allFlag) {
    return 'all';
  }

  // Check if --projects argument exists
  if (!projectsArg) {
    console.error('Error: Either --projects, ie --projects=default,starknet or --all argument is required.');
    process.exit(1);  // Exit the script with an error code
  }

  // Extract the value of --projects (after the '=' sign)
  const projectsValue = projectsArg.split('=')[1];

  if (!projectsValue) {
    console.error('Error: --projects argument is empty.');
    process.exit(1);  // Exit the script with an error code
  }

  // Split the value by commas to get an array of project names
  const projects = projectsValue.split(',');

  return projects;
}

// Function to parse CLI arguments
function parseArgument(argumentName: string) {
  const arg = args.find(arg => arg.startsWith(`--${argumentName}=`));
  return arg ? arg.split('=')[1] : undefined;
}

// Function to parse dependencies passed from CLI (comma-separated list)
function parseDependenciesArgument(): Dependency[] {
  const depsArg = parseArgument('dependencies');
  if (!depsArg) {
    return [];
  }

  return depsArg.split(',').map(dep => {
    const [name, version = 'latest'] = dep.split('@');
    return { name, version, import: true };
  });
}

// Function to parse copy argument
function parseCopyArgument(): boolean {
  return parseArgument('copy') ? true : false
}

// Function to parse custom name argument
function parseCustomNameArgument(): string | undefined {
  return parseArgument('name');
}

// Main script logic
const projects = parseProjectsArgument();
const cliDependencies = parseDependenciesArgument();
const copyTemplate = parseCopyArgument();
const customName = parseCustomNameArgument();

if (projects === 'all') {
  console.log('All projects selected.');
  if (copyTemplate) {
    // return error if --copy flag is used with --all flag
    console.error('Error: --copy flag cannot be used without specifying a project.');
    process.exit(1);  // Exit the script with an error code
  }
} else {
  console.log('Selected projects:', projects);
  if (projects.length > 1 && (customName || copyTemplate)) {
    // return error if --name flag is used with multiple projects
    console.error('Error: --name flag cannot be used with multiple projects.');
    process.exit(1);  // Exit the script with an error code
  }
  if (projects.length === 1 && !customName && copyTemplate) {
    // return error if no --name flag is used with single project
    console.error('Error: --name flag is required for single project.');
    process.exit(1);  // Exit the script with an error code
  }
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
  console.log(`Copying ${src} to ${dest}`);
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

// Helper function to check if a project-specific file exists in the project's subdirectory of templateDir
const getFilePath = (projectName: string, templateDir: string | undefined, baseTemplateDir: string, fileName: string): string => {
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
  return path.join(baseTemplateDir, fileName);
};

// Function to perform replacements in the template
const performReplacements = (
  template: string,
  replacements: { [placeholder: string]: string },
  projectName: string,
  templateDir: string | undefined,
  baseTemplateDir: string
): string => {
  let updatedTemplate = template;

  // Iterate through each placeholder and its corresponding file
  Object.entries(replacements).forEach(([placeholder, fileName]) => {
    // Get the full path to the replacement file (use project-specific or default template)
    const filePath = getFilePath(projectName, templateDir, baseTemplateDir, fileName);

    // Read the content of the file that corresponds to the placeholder
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Replace the placeholder in the template with the file content
    updatedTemplate = updatedTemplate.replace(new RegExp(`//{{${placeholder}}}`, 'g'), fileContent);
  });

  return updatedTemplate;
};

// Function to copy only files from the `files` subdirectory of the template directories
const copyTemplateFiles = (src: string, projectName: string, templateDir: string | undefined, baseTemplateDir: string, projectDir: string) => {

  // Default files directory within baseTemplateDir
  const defaultFilesDir = path.join(baseTemplateDir, src);
  if (fs.existsSync(defaultFilesDir)) {
    copyRecursiveSync(defaultFilesDir, projectDir);
  }

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
};

// Function to determine if a dependency should be imported, required, or added to window object
const generateImportStatement = (dep: Dependency): string => {
  let importStatement = '';

  // Skip if import is set to false
  if (dep.import === false) {
    return '';
  }

  // Use require if specified
  if (dep.require) {
    const alias = dep.alias || dep.name;
    importStatement = `const ${alias.replace(/[^a-zA-Z0-9]/g, '_')} = require('${dep.name}');\n`;
  } else {
    const alias = dep.alias || dep.name;
    importStatement = `import * as ${alias.replace(/[^a-zA-Z0-9]/g, '_')} from '${dep.name}';\n`;
  }

  // If windowImport is true, add the window assignment
  if (dep.windowImport === undefined || dep.windowImport === true) {
    const alias = dep.alias || dep.name;
    const windowAlias = dep.windowAlias || dep.name;
    importStatement += `window['${windowAlias}'] = ${alias.replace(/[^a-zA-Z0-9]/g, '_')};\n`;
  }

  return importStatement;
};

const templateDir = projectConfigs.templateDir;
const baseTemplateDir = projectConfigs.baseTemplateDir;
const tsTemplate = projectConfigs.tsTemplate;

console.log(JSON.stringify(projectConfigs.projects, null, 2));


// Loop over each project in the projectConfigs array
projectConfigs.projects.forEach((project: ProjectConfiguration) => {
  if (!projects.includes('all') && !projects.includes(project.name)) {
    return;
  }
  const { name, dependencies, replacements } = project;

  console.log(`Creating project ${name}...`, dependencies);

  // Set up the project directory inside the "projects" subdirectory
  const projectDir = path.join(__dirname, 'projects', customName || name);

  // If the project directory exists, delete it
  if (fs.existsSync(projectDir)) {
    console.log(`Directory ${projectDir} already exists. Deleting it...`);
    fs.rmSync(projectDir, { recursive: true, force: true });
  }

  // Create a fresh project directory
  fs.mkdirSync(projectDir, { recursive: true });

  // Construct the full path to the TypeScript template file (use project-specific or default template)
  const tsTemplatePath = getFilePath(name, templateDir, baseTemplateDir, tsTemplate);

  // Read the TypeScript template file
  const templateContent: string = fs.readFileSync(tsTemplatePath, 'utf8');

  // Perform the replacements in the template
  const finalTsContent = performReplacements(templateContent, replacements, name, templateDir, baseTemplateDir);

  // Read the default package.json template
  const defaultPackageJsonPath = path.join(baseTemplateDir, 'defaultPackage.json');
  const defaultPackageJson = JSON.parse(fs.readFileSync(defaultPackageJsonPath, 'utf8'));

  // Create the project-specific package.json content
  const projectPackageJson = {
    name: name || "default-project-name",
    dependencies: [...dependencies, ...cliDependencies].reduce((acc, dep) => {
      acc[dep.name] = dep.version;
      return acc;
    }, {} as { [key: string]: string })
  };

  // Merge the default package.json with the project-specific content
  const mergedPackageJson = deepMerge(defaultPackageJson, projectPackageJson);

  // Write the merged package.json to the project directory
  const packageJsonPath = path.join(projectDir, 'package.json');
  fs.writeFileSync(packageJsonPath, JSON.stringify(mergedPackageJson, null, 2));

  // Generate TypeScript import statements
  let tsImports: string = '';
  [...dependencies].forEach(dep => {
    tsImports += generateImportStatement(dep);
  });

  [...cliDependencies].forEach(dep => {
    dep.windowImport = true;
    tsImports += generateImportStatement(dep);
  });

  // Combine imports and the processed template content
  const fullTsContent = `${tsImports}\n${finalTsContent}`;

  // Create src directory
  const srcDir = path.join(projectDir, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

  // Write the generated TypeScript content to the project directory
  const outputTsFilePath = path.join(srcDir, 'script-runner.ts');
  fs.writeFileSync(outputTsFilePath, fullTsContent);

  // Copy only files from the `files` subdirectory of both the template and default template directories
  const filesDir = path.join(srcDir, 'lib');
  copyTemplateFiles('src/lib', name, templateDir, baseTemplateDir, filesDir);

  // Copy webpack.config.js file to the project directory
  const configDir = path.join(projectDir, 'webpack.config.js');
  copyTemplateFiles('webpack.config.js', name, templateDir, baseTemplateDir, configDir);

  // copy tsconfig.json file to the project directory
  const tsconfigDir = path.join(projectDir, 'tsconfig.json');
  copyTemplateFiles('tsconfig.json', name, templateDir, baseTemplateDir, tsconfigDir);

  // Change directory to the project folder and run yarn to install dependencies
  console.log(`Installing dependencies in ${projectDir}...`);
  // execSync('yarn install', { cwd: projectDir, stdio: 'inherit' });
  if (buildProjectArg) {
    try {
      // Execute the bash script
      const out = execSync(`./buildProject.bash ${customName ? customName : name}`, { stdio: 'pipe' });
      
      // Convert the output buffer to a string and log it
      console.log(out.toString());
    } catch (error) {
      
      if((error as any).stderr) {
        console.error((error as any).stderr.toString());
      }
      if((error as any).stdout) {
        console.error((error as any).stdout.toString());
      }
      if((error as any).output) {
        console.error((error as any).output.toString());
      }
      if (error instanceof Error) {
        const execError = error as ExecSyncError;
        const errString = execError.stderr.toString()
        // split the error string by new line
        const errors = errString.split('\n')
        // log each error
        errors.forEach(err => {
          // only show error lines
          if (err.includes('error')) console.error(err);
        });
        console.error(execError.stderr.toString());
        exit(1)
      } else {
        console.error('Unknown error', error);
      }
    }
  }

  // Console log for successful project generation
  console.log(`Project ${name} has been created in ${projectDir} and dependencies installed.`);
  console.log(`Generated TypeScript file at ${outputTsFilePath}`);
});