import { dirname, resolve } from 'path';

const baseDirectory = dirname(__dirname);
const swaggerPath = resolve(baseDirectory, 'swagger', 'swaggerRoutes');
const templatePath = resolve(baseDirectory, 'templates');

export {
  swaggerPath,
  templatePath,
};