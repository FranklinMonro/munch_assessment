import fs from 'fs';
import path from 'path';

import { swaggerPath } from '../server/apiPaths';
// import { swaggerLogger as log } from '../server/winstonLog';

const createSwaggerImport = () => {
  const swaggerFiles: string[] = fs.readdirSync(swaggerPath);
  const swaggerJson: any[] = [];
  swaggerFiles.forEach(async (file: string): Promise<any> => {
    const importPath = path.resolve(swaggerPath, file);
    const swaggerJsonString = fs.readFileSync(importPath, 'utf8');
    swaggerJson.push(JSON.parse(swaggerJsonString));
  });
  return swaggerJson;
};

const addToSwaggerConfig = (config: any): any => {
  const swaggerJson = createSwaggerImport();
  swaggerJson.forEach((eleIn: any) => {
    Object.entries(eleIn).forEach((inEntries) => {
      const entrykey1 = inEntries[0] !== null || inEntries[0] !== undefined ? inEntries[0] : '';
      if (entrykey1 === 'paths') {
        const keyConf1 = entrykey1 as keyof typeof config;
        const keyInc1 = entrykey1 as keyof typeof eleIn;
        Object.assign(config[keyConf1], eleIn[keyInc1]);
      }
      if (entrykey1 === 'components') {
        const schemas = inEntries[1] as keyof typeof entrykey1;
        Object.entries(schemas).forEach((ele) => {
          const entrykey2 = ele[0] !== null || ele[0] !== undefined ? ele[0] : '';
          const keyConf2 = entrykey2 as keyof typeof config;
          Object.assign(config[entrykey1][keyConf2], ele[1]);
        });
      }
    });
  });
  return config;
};

export default addToSwaggerConfig;