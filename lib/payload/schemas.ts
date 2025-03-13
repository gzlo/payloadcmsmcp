import { z } from 'zod';

// Field types supported by Payload CMS 3.0
export const FieldTypes = [
  'text',
  'textarea',
  'email',
  'code',
  'number',
  'date',
  'checkbox',
  'select',
  'relationship',
  'upload',
  'array',
  'blocks',
  'group',
  'row',
  'collapsible',
  'tabs',
  'richText',
  'json',
  'radio',
  'point',
] as const;

// Base field schema that all field types extend
export const BaseFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().optional(),
  required: z.boolean().optional(),
  unique: z.boolean().optional(),
  index: z.boolean().optional(),
  defaultValue: z.any().optional(),
  hidden: z.boolean().optional(),
  saveToJWT: z.boolean().optional(),
  localized: z.boolean().optional(),
  validate: z.function().optional(),
  hooks: z.object({
    beforeValidate: z.function().optional(),
    beforeChange: z.function().optional(),
    afterChange: z.function().optional(),
    afterRead: z.function().optional(),
  }).optional(),
  admin: z.object({
    position: z.string().optional(),
    width: z.string().optional(),
    style: z.record(z.any()).optional(),
    className: z.string().optional(),
    readOnly: z.boolean().optional(),
    hidden: z.boolean().optional(),
    description: z.string().optional(),
    condition: z.function().optional(),
    components: z.record(z.any()).optional(),
  }).optional(),
  access: z.object({
    read: z.union([z.function(), z.boolean()]).optional(),
    create: z.union([z.function(), z.boolean()]).optional(),
    update: z.union([z.function(), z.boolean()]).optional(),
  }).optional(),
});

// Text field schema
export const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal('text'),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  hasMany: z.boolean().optional(),
});

// Number field schema
export const NumberFieldSchema = BaseFieldSchema.extend({
  type: z.literal('number'),
  min: z.number().optional(),
  max: z.number().optional(),
  hasMany: z.boolean().optional(),
});

// Select field schema
export const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal('select'),
  options: z.array(
    z.union([
      z.string(),
      z.object({
        label: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]),
      }),
    ])
  ),
  hasMany: z.boolean().optional(),
});

// Relationship field schema
export const RelationshipFieldSchema = BaseFieldSchema.extend({
  type: z.literal('relationship'),
  relationTo: z.union([z.string(), z.array(z.string())]),
  hasMany: z.boolean().optional(),
  filterOptions: z.function().optional(),
  maxDepth: z.number().optional(),
});

// Array field schema
export const ArrayFieldSchema = BaseFieldSchema.extend({
  type: z.literal('array'),
  minRows: z.number().optional(),
  maxRows: z.number().optional(),
  fields: z.lazy(() => z.array(FieldSchema)),
});

// Group field schema
export const GroupFieldSchema = BaseFieldSchema.extend({
  type: z.literal('group'),
  fields: z.lazy(() => z.array(FieldSchema)),
});

// Tabs field schema
export const TabsFieldSchema = BaseFieldSchema.extend({
  type: z.literal('tabs'),
  tabs: z.array(
    z.object({
      label: z.string(),
      name: z.string().optional(),
      fields: z.lazy(() => z.array(FieldSchema)),
    })
  ),
});

// Rich text field schema
export const RichTextFieldSchema = BaseFieldSchema.extend({
  type: z.literal('richText'),
  admin: z.object({
    elements: z.array(z.string()).optional(),
    leaves: z.array(z.string()).optional(),
    hideGutter: z.boolean().optional(),
    placeholder: z.string().optional(),
  }).optional(),
});

// Union of all field schemas
export const FieldSchema = z.union([
  TextFieldSchema,
  NumberFieldSchema,
  SelectFieldSchema,
  RelationshipFieldSchema,
  ArrayFieldSchema,
  GroupFieldSchema,
  TabsFieldSchema,
  RichTextFieldSchema,
  // Add other field schemas as needed
  BaseFieldSchema.extend({ type: z.enum(FieldTypes) }),
]);

// Collection schema
export const CollectionSchema = z.object({
  slug: z.string().min(1),
  labels: z.object({
    singular: z.string().optional(),
    plural: z.string().optional(),
  }).optional(),
  admin: z.object({
    useAsTitle: z.string().optional(),
    defaultColumns: z.array(z.string()).optional(),
    listSearchableFields: z.array(z.string()).optional(),
    group: z.string().optional(),
    description: z.string().optional(),
    hideAPIURL: z.boolean().optional(),
    disableDuplicate: z.boolean().optional(),
    preview: z.function().optional(),
  }).optional(),
  access: z.object({
    read: z.union([z.function(), z.boolean()]).optional(),
    create: z.union([z.function(), z.boolean()]).optional(),
    update: z.union([z.function(), z.boolean()]).optional(),
    delete: z.union([z.function(), z.boolean()]).optional(),
    admin: z.union([z.function(), z.boolean()]).optional(),
  }).optional(),
  fields: z.array(FieldSchema),
  hooks: z.object({
    beforeOperation: z.function().optional(),
    beforeValidate: z.function().optional(),
    beforeChange: z.function().optional(),
    afterChange: z.function().optional(),
    beforeRead: z.function().optional(),
    afterRead: z.function().optional(),
    beforeDelete: z.function().optional(),
    afterDelete: z.function().optional(),
  }).optional(),
  endpoints: z.array(
    z.object({
      path: z.string(),
      method: z.enum(['get', 'post', 'put', 'patch', 'delete']),
      handler: z.function(),
    })
  ).optional(),
  versions: z.object({
    drafts: z.boolean().optional(),
    max: z.number().optional(),
  }).optional(),
  timestamps: z.boolean().optional(),
  auth: z.boolean().optional(),
  upload: z.object({
    staticDir: z.string(),
    staticURL: z.string(),
    mimeTypes: z.array(z.string()).optional(),
    filesizeLimit: z.number().optional(),
    imageSizes: z.array(
      z.object({
        name: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
        crop: z.string().optional(),
      })
    ).optional(),
  }).optional(),
});

// Global schema
export const GlobalSchema = z.object({
  slug: z.string().min(1),
  label: z.string().optional(),
  admin: z.object({
    description: z.string().optional(),
    group: z.string().optional(),
  }).optional(),
  access: z.object({
    read: z.union([z.function(), z.boolean()]).optional(),
    update: z.union([z.function(), z.boolean()]).optional(),
  }).optional(),
  fields: z.array(FieldSchema),
  hooks: z.object({
    beforeValidate: z.function().optional(),
    beforeChange: z.function().optional(),
    afterChange: z.function().optional(),
    beforeRead: z.function().optional(),
    afterRead: z.function().optional(),
  }).optional(),
  versions: z.object({
    drafts: z.boolean().optional(),
    max: z.number().optional(),
  }).optional(),
});

// Config schema
export const ConfigSchema = z.object({
  collections: z.array(CollectionSchema).optional(),
  globals: z.array(GlobalSchema).optional(),
  admin: z.object({
    user: z.string().optional(),
    meta: z.object({
      titleSuffix: z.string().optional(),
      favicon: z.string().optional(),
      ogImage: z.string().optional(),
    }).optional(),
    components: z.record(z.any()).optional(),
    css: z.string().optional(),
    dateFormat: z.string().optional(),
  }).optional(),
  serverURL: z.string().optional(),
  cors: z.array(z.string()).optional(),
  csrf: z.array(z.string()).optional(),
  routes: z.object({
    admin: z.string().optional(),
    api: z.string().optional(),
    graphQL: z.string().optional(),
    graphQLPlayground: z.string().optional(),
  }).optional(),
  defaultDepth: z.number().optional(),
  maxDepth: z.number().optional(),
  rateLimit: z.object({
    window: z.number().optional(),
    max: z.number().optional(),
    trustProxy: z.boolean().optional(),
    skip: z.function().optional(),
  }).optional(),
  upload: z.object({
    limits: z.object({
      fileSize: z.number().optional(),
    }).optional(),
  }).optional(),
  plugins: z.array(z.any()).optional(),
  typescript: z.object({
    outputFile: z.string().optional(),
  }).optional(),
  graphQL: z.object({
    schemaOutputFile: z.string().optional(),
    disablePlaygroundInProduction: z.boolean().optional(),
  }).optional(),
  telemetry: z.boolean().optional(),
  debug: z.boolean().optional(),
}); 