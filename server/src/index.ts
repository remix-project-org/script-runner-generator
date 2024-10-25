import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import cors from 'cors'; // Import cors
import { customScriptRunnerConfig } from '../../src/project-configurations';
import md5 from 'md5';
import fs from 'fs';

const app = express();
const port = 4000;

app.use(cors());
// Middleware to parse incoming JSON data
app.use(express.json());

app.post('/build', (req: Request, res: Response) => {
  const payload = req.body;

  if (!payload || Object.keys(payload).length === 0) {
    return res.status(400).json({ error: 'Empty payload' });
  }

  console.log('Received payload:', payload);

  const configuation: customScriptRunnerConfig = payload

  if(!configuation.baseConfiguration){
    return res.status(400).json({ error: 'Empty baseConfiguration' });
  }
  // check if dependencies is an array
  if(!Array.isArray(configuation.dependencies)){
    return res.status(400).json({ error: 'dependencies is not an array' });
  }

  if(!configuation.dependencies.length){
    return res.status(400).json({ error: 'Empty dependencies' });
  }

  if(!configuation.dependencies.every((dep) => dep.version && dep.name)){
    return res.status(400).json({ error: 'dependencies should have version and name' });
  }

  // parse dependencies to a comma separated string
  const dependencies = configuation.dependencies.map((dep) => `${dep.name}@${dep.version}`).join(',');
  console.log('Dependencies:', dependencies);

  // hash the json payload
  const hash = md5(JSON.stringify(payload));

  // check if the build already exists
  // if it exists, return the hash
  // if it does not exist, create the build
  // and return the hash
  const buildExists = fs.existsSync(`./build/projects/${hash}/script-runner.js`);

  if (buildExists) {
    //return res.json({ message: 'Build already exists', hash });
  }

  const command = `NODE_ENV=development yarn generate --projects=${configuation.baseConfiguration} --build --copy --name=${hash} --dependencies=${dependencies}`;
  console.log('Command  to execute', command);

  //return res.json({ message: 'Build executed successfully', command });
  // Execute yarn command
  exec(command, (error, stdout, stderr) => {
    if (error) {

      const errString = stderr.toString()
      // split the error string by new line
      const errors = errString.split('\n')
      // log each error
      const errorLines: string[] = []
      errors.forEach(err => {
        // only show error lines
        if (err.includes('error')) {
          errorLines.push(err)
        }
      });
      //console.error(`STDERR:`, stderr);
      return res.status(500).json({ error: errorLines });
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    res.json({ message: 'Build executed successfully', hash, stdout, stderr });
  });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
