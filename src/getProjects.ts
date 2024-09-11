import { projectConfigs, ProjectConfiguration, Dependency } from './project-configurations'; // Import the project configurations

projectConfigs.projects.map((project: ProjectConfiguration) => { // Map over the projects
    console.log(project.name); // Log the project name
});