import addToSwaggerConfig from './swaggerUtils';

const config = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'Munch API',
    description: 'Endpoints for Munch API',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: '/api/',
      description: 'Local Dev',
    },
  ],
  tags: [
    {
      name: 'Create POS',
      description: 'API for POS',
    },
  ],
  consumes: [
    'application/json',
  ],
  produces: [
    'application/json',
  ],
  paths: {},
  components: {
    schemas: {},
  },
};

export default addToSwaggerConfig(config);