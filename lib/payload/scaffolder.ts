import { z } from 'zod';
import { generateTemplate } from './generator';

/**
 * Options for scaffolding a Payload CMS 3 project
 */
export interface ScaffoldOptions {
  projectName: string;
  description?: string;
  serverUrl?: string;
  database?: 'mongodb' | 'postgres';
  auth?: boolean;
  admin?: {
    user?: string;
    bundler?: 'webpack' | 'vite';
  };
  collections?: {
    name: string;
    fields?: {
      name: string;
      type: string;
      required?: boolean;
      unique?: boolean;
    }[];
    auth?: boolean;
    timestamps?: boolean;
    admin?: {
      useAsTitle?: string;
      group?: string;
    };
    versions?: boolean;
  }[];
  globals?: {
    name: string;
    fields?: {
      name: string;
      type: string;
    }[];
    versions?: boolean;
  }[];
  blocks?: {
    name: string;
    fields?: {
      name: string;
      type: string;
    }[];
    imageField?: boolean;
    contentField?: boolean;
  }[];
  plugins?: string[];
  typescript?: boolean;
}

/**
 * Scaffold file structure for a Payload CMS 3 project
 */
export interface ScaffoldFileStructure {
  [path: string]: string | ScaffoldFileStructure;
}

/**
 * Scaffolds a Payload CMS 3 project
 */
export const scaffoldProject = (options: ScaffoldOptions): ScaffoldFileStructure => {
  const {
    projectName,
    description = `A Payload CMS 3 project`,
    serverUrl = 'http://localhost:3000',
    database = 'mongodb',
    auth = true,
    admin = {},
    collections = [],
    globals = [],
    blocks = [],
    plugins = [],
    typescript = true,
  } = options;

  // Create the file structure
  const fileStructure: ScaffoldFileStructure = {
    // Root files
    'package.json': generatePackageJson(projectName, description, database, typescript, plugins),
    'tsconfig.json': generateTsConfig(),
    '.env': generateEnvFile(database),
    '.env.example': generateEnvFile(database),
    '.gitignore': generateGitignore(),
    'README.md': generateReadme(projectName, description),
    
    // Source directory
    'src': {
      // Config
      'payload.config.ts': generatePayloadConfig(projectName, serverUrl, database, admin, typescript),
      
      // Collections
      'collections': collections.reduce((acc, collection) => {
        acc[`${collection.name}.ts`] = generateTemplate('collection', {
          slug: collection.name,
          fields: collection.fields || [],
          auth: collection.auth,
          timestamps: collection.timestamps !== false, // Default to true
          admin: collection.admin,
          versions: collection.versions,
          access: true, // Always include access control
          hooks: true, // Always include hooks
        });
        return acc;
      }, {} as ScaffoldFileStructure),
      
      // Globals
      'globals': globals.reduce((acc, global) => {
        acc[`${global.name}.ts`] = generateTemplate('global', {
          slug: global.name,
          fields: global.fields || [],
          versions: global.versions,
          access: true, // Always include access control
        });
        return acc;
      }, {} as ScaffoldFileStructure),
      
      // Blocks
      'blocks': blocks.reduce((acc, block) => {
        acc[`${block.name}.ts`] = generateTemplate('block', {
          slug: block.name,
          fields: block.fields || [],
          imageField: block.imageField,
          contentField: block.contentField,
        });
        return acc;
      }, {} as ScaffoldFileStructure),
      
      // Access control
      'access': {
        'index.ts': generateAccessIndex(),
      },
      
      // Hooks
      'hooks': {
        'index.ts': generateHooksIndex(),
      },
      
      // Endpoints
      'endpoints': {
        'index.ts': generateEndpointsIndex(),
      },
      
      // Server
      'server.ts': generateServer(),
    },
  };

  return fileStructure;
};

/**
 * Generates a package.json file
 */
const generatePackageJson = (
  projectName: string,
  description: string,
  database: 'mongodb' | 'postgres',
  typescript: boolean,
  plugins: string[]
): string => {
  const dbDependency = database === 'mongodb'
    ? `"@payloadcms/db-mongodb": "^1.0.0",`
    : `"@payloadcms/db-postgres": "^1.0.0",`;
  
  const pluginDependencies = plugins.map(plugin => {
    switch (plugin) {
      case 'seo':
        return `"@payloadcms/plugin-seo": "^1.0.0",`;
      case 'nested-docs':
        return `"@payloadcms/plugin-nested-docs": "^1.0.0",`;
      case 'form-builder':
        return `"@payloadcms/plugin-form-builder": "^1.0.0",`;
      case 'cloud':
        return `"@payloadcms/plugin-cloud": "^1.0.0",`;
      default:
        return '';
    }
  }).filter(Boolean).join('\n    ');

  return `{
  "name": "${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "description": "${description}",
  "version": "1.0.0",
  "main": "dist/server.js",
  "license": "MIT",
  "scripts": {
    "dev": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts nodemon",
    "build:payload": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload build",
    "build:server": "${typescript ? 'tsc' : 'copyfiles src/* dist/'}",
    "build": "yarn build:payload && yarn build:server",
    "start": "cross-env PAYLOAD_CONFIG_PATH=dist/payload.config.js NODE_ENV=production node dist/server.js",
    "generate:types": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload generate:types",
    "generate:graphQLSchema": "cross-env PAYLOAD_CONFIG_PATH=src/payload.config.ts payload generate:graphQLSchema"
  },
  "dependencies": {
    "payload": "^2.0.0",
    ${dbDependency}
    "@payloadcms/richtext-lexical": "^1.0.0",
    ${pluginDependencies}
    "dotenv": "^16.0.0",
    "express": "^4.17.1"
  },
  "devDependencies": {
    ${typescript ? `
    "typescript": "^5.0.0",
    "@types/express": "^4.17.9",
    ` : ''}
    "cross-env": "^7.0.3",
    "nodemon": "^2.0.6",
    ${typescript ? '' : '"copyfiles": "^2.4.1",'}
    "payload-types": "file:src/payload-types.ts"
  }
}`;
};

/**
 * Generates a tsconfig.json file
 */
const generateTsConfig = (): string => {
  return `{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true,
    "sourceMap": true,
    "declaration": true,
    "jsx": "react",
    "baseUrl": ".",
    "paths": {
      "payload/generated-types": ["src/payload-types.ts"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`;
};

/**
 * Generates an .env file
 */
const generateEnvFile = (database: 'mongodb' | 'postgres'): string => {
  return `# Server
PORT=3000
NODE_ENV=development

# Database
${database === 'mongodb' 
  ? 'MONGODB_URI=mongodb://localhost:27017/payload-cms-3-project'
  : 'DATABASE_URI=postgres://postgres:postgres@localhost:5432/payload-cms-3-project'}

# Payload
PAYLOAD_SECRET=your-payload-secret-key-here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000`;
};

/**
 * Generates a .gitignore file
 */
const generateGitignore = (): string => {
  return `# dependencies
/node_modules

# build
/dist
/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# payload
/src/payload-types.ts`;
};

/**
 * Generates a README.md file
 */
const generateReadme = (projectName: string, description: string): string => {
  return `# ${projectName}

${description}

## Getting Started

### Development

1. Clone this repository
2. Install dependencies with \`yarn\` or \`npm install\`
3. Copy \`.env.example\` to \`.env\` and configure your environment variables
4. Start the development server with \`yarn dev\` or \`npm run dev\`
5. Visit http://localhost:3000/admin to access the admin panel

### Production

1. Build the project with \`yarn build\` or \`npm run build\`
2. Start the production server with \`yarn start\` or \`npm start\`

## Features

- Payload CMS 3.0
- TypeScript
- Express server
- Admin panel
- API endpoints
- GraphQL API

## Project Structure

- \`/src\` - Source code
  - \`/collections\` - Collection definitions
  - \`/globals\` - Global definitions
  - \`/blocks\` - Block definitions
  - \`/access\` - Access control functions
  - \`/hooks\` - Hook functions
  - \`/endpoints\` - Custom API endpoints
  - \`payload.config.ts\` - Payload configuration
  - \`server.ts\` - Express server

## License

MIT`;
};

/**
 * Generates a payload.config.ts file
 */
const generatePayloadConfig = (
  projectName: string,
  serverUrl: string,
  database: 'mongodb' | 'postgres',
  admin: any,
  typescript: boolean
): string => {
  return generateTemplate('config', {
    projectName,
    serverUrl,
    admin,
    db: database,
    typescript,
    csrf: true,
    rateLimit: true,
  });
};

/**
 * Generates an access/index.ts file
 */
const generateAccessIndex = (): string => {
  return `// Export all access control functions
export * from './isAdmin';
export * from './isAdminOrEditor';
export * from './isAdminOrSelf';

// Example access control function for admin users
export const isAdmin = ({ req }) => {
  return req.user?.role === 'admin';
};

// Example access control function for admin or editor users
export const isAdminOrEditor = ({ req }) => {
  return ['admin', 'editor'].includes(req.user?.role);
};

// Example access control function for admin users or the user themselves
export const isAdminOrSelf = ({ req }) => {
  const { user } = req;
  
  if (!user) return false;
  if (user.role === 'admin') return true;
  
  // If there's an ID in the URL, check if it matches the user's ID
  const id = req.params?.id;
  if (id && user.id === id) return true;
  
  return false;
};`;
};

/**
 * Generates a hooks/index.ts file
 */
const generateHooksIndex = (): string => {
  return `// Export all hook functions
export * from './populateCreatedBy';
export * from './formatSlug';

// Example hook to populate createdBy field
export const populateCreatedBy = ({ req }) => {
  return {
    createdBy: req.user?.id,
  };
};

// Example hook to format a slug
export const formatSlug = ({ value }) => {
  if (!value) return '';
  
  return value
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\\w-]+/g, '');
};`;
};

/**
 * Generates an endpoints/index.ts file
 */
const generateEndpointsIndex = (): string => {
  return `import { Payload } from 'payload';
import { Request, Response } from 'express';

// Register all custom endpoints
export const registerEndpoints = (payload: Payload): void => {
  // Example health check endpoint
  payload.router.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      message: 'API is healthy',
      timestamp: new Date().toISOString(),
    });
  });
  
  // Example custom data endpoint
  payload.router.get('/api/custom-data', async (req: Request, res: Response) => {
    try {
      // Example: Get data from a collection
      // const result = await payload.find({
      //   collection: 'your-collection',
      //   limit: 10,
      // });
      
      res.status(200).json({
        message: 'Custom data endpoint',
        // data: result.docs,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching data',
        error: error.message,
      });
    }
  });
};`;
};

/**
 * Generates a server.ts file
 */
const generateServer = (): string => {
  return `import express from 'express';
import payload from 'payload';
import { registerEndpoints } from './endpoints';
import path from 'path';

// Load environment variables
require('dotenv').config();

// Create an Express app
const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

// Initialize Payload
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-payload-secret-key-here',
    express: app,
    onInit: () => {
      payload.logger.info(\`Payload Admin URL: \${payload.getAdminURL()}\`);
    },
  });

  // Register custom endpoints
  registerEndpoints(payload);

  // Add your own express routes here
  app.get('/api/custom-route', (req, res) => {
    res.json({ message: 'Custom route' });
  });

  // Serve static files from the 'public' directory
  app.use('/public', express.static(path.resolve(__dirname, '../public')));

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    payload.logger.info(\`Server started on port \${PORT}\`);
  });
};

start();`;
};

/**
 * Validates scaffold options
 */
export const validateScaffoldOptions = (options: any): { isValid: boolean; errors?: string[] } => {
  try {
    const schema = z.object({
      projectName: z.string().min(1, "Project name is required"),
      description: z.string().optional(),
      serverUrl: z.string().url("Server URL must be a valid URL").optional(),
      database: z.enum(['mongodb', 'postgres']).optional(),
      auth: z.boolean().optional(),
      admin: z.object({
        user: z.string().optional(),
        bundler: z.enum(['webpack', 'vite']).optional(),
      }).optional(),
      collections: z.array(
        z.object({
          name: z.string().min(1, "Collection name is required"),
          fields: z.array(
            z.object({
              name: z.string().min(1, "Field name is required"),
              type: z.string().min(1, "Field type is required"),
              required: z.boolean().optional(),
              unique: z.boolean().optional(),
            })
          ).optional(),
          auth: z.boolean().optional(),
          timestamps: z.boolean().optional(),
          admin: z.object({
            useAsTitle: z.string().optional(),
            group: z.string().optional(),
          }).optional(),
          versions: z.boolean().optional(),
        })
      ).optional(),
      globals: z.array(
        z.object({
          name: z.string().min(1, "Global name is required"),
          fields: z.array(
            z.object({
              name: z.string().min(1, "Field name is required"),
              type: z.string().min(1, "Field type is required"),
            })
          ).optional(),
          versions: z.boolean().optional(),
        })
      ).optional(),
      blocks: z.array(
        z.object({
          name: z.string().min(1, "Block name is required"),
          fields: z.array(
            z.object({
              name: z.string().min(1, "Field name is required"),
              type: z.string().min(1, "Field type is required"),
            })
          ).optional(),
          imageField: z.boolean().optional(),
          contentField: z.boolean().optional(),
        })
      ).optional(),
      plugins: z.array(z.string()).optional(),
      typescript: z.boolean().optional(),
    });
    
    schema.parse(options);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      };
    }
    
    return {
      isValid: false,
      errors: [(error as Error).message],
    };
  }
}; 