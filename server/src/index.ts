import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import cors from 'cors'; // Import cors
import { customScriptRunnerConfig } from '../../src/project-configurations';
import md5 from 'md5';

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
  const dependencies = configuation.dependencies.map((dep) => `${dep.name}@${dep.version}`).join(' ');
  console.log('Dependencies:', dependencies);

  // hash the json payload
  const hash = md5(JSON.stringify(payload));


  const command = `NODE_ENV=development yarn generate --projects=${configuation.baseConfiguration} --build --copy --name=${hash} ${dependencies}`;
  console.log('Command  to execute', command);

  //return res.json({ message: 'Build executed successfully', command });
  // Execute yarn command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing yarn build: ${error}`);
      return res.status(500).json({ error: `Error executing yarn build: ${error.message}` });
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

    res.json({ message: 'Build executed successfully', stdout, stderr });
  });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
