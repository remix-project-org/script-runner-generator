import { projectConfigs, ProjectConfiguration, Dependency } from './project-configurations'; // Import the project configurations
import fs from 'fs'; // Import the fs module

const existingProjects: ProjectConfiguration[] = []; // Create an array to store the existing projects
projectConfigs.projects.map((project: ProjectConfiguration) => { // Map over the projects
    console.log(project.name); // Log the project name
    if(fs.existsSync(`./build/projects/${project.name}/script-runner.js`)) {
        console.log('Project ' + project.name + ' exists');
        existingProjects.push(project);
    }
});

console.log('Existing projects:', existingProjects); // Log the existing projects
fs.writeFileSync('./build/projects.json', JSON.stringify(existingProjects, null, 2));