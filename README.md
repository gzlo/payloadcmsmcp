# 🚀 Payload CMS 3.0 MCP Server

<div align="center">
  <p align="center">
    <img src="https://www.payloadcmsmcp.info/logopayload.png" alt="Payload CMS Logo" width="120" height="120" style="border-radius: 10px; padding: 5px; background-color: white; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);" />
  </p>
<p align="center">
    <img src="https://img.shields.io/badge/Model%20Context%20Protocol-Enabled-6366F1?style=for-the-badge" alt="MCP Enabled" />
    <img src="https://img.shields.io/badge/Payload%20CMS%203.0-Integration-3B82F6?style=for-the-badge" alt="Payload CMS" />
    <img src="https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge" alt="License" />
    <img src="https://img.shields.io/badge/Railway-Deployment-0B0D0E?style=for-the-badge" alt="Railway Deployment" />
  </p>
  
  <h3>A specialized MCP server for Payload CMS 3.0</h3>
  <p>Validate code, generate templates, and scaffold projects following best practices</p>
</div>

<hr>

## 📋 Overview

The Payload CMS 3.0 MCP Server is a specialized Model Context Protocol server designed to enhance your Payload CMS development experience. It helps developers build better Payload CMS applications by providing code validation, template generation, and project scaffolding capabilities that follow best practices.

<hr>

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>📚</h3>
        <b>Code Validation</b>
        <p>Validate Payload CMS code for collections, fields, globals, and config files with detailed feedback on syntax errors and best practices.</p>
      </td>
      <td align="center">
        <h3>🔍</h3>
        <b>Code Generation</b>
        <p>Generate code templates for collections, fields, globals, access control, hooks, endpoints, plugins, blocks, and migrations.</p>
      </td>
      <td align="center">
        <h3>🚀</h3>
        <b>Project Scaffolding</b>
        <p>Scaffold entire Payload CMS projects with validated options for consistency and adherence to best practices.</p>
      </td>
    </tr>
  </table>
</div>

<hr>

## 🔧 Payload CMS 3.0 Capabilities

### Validation Tools

* `validate` - Validate code for collections, fields, globals, and config
* `query` - Query validation rules and best practices
* `mcp_query` - Execute SQL-like queries for Payload CMS structures

### Code Generation

* `generate_template` - Generate code templates for various components
* `generate_collection` - Create complete collection definitions
* `generate_field` - Generate field definitions with proper typing

### Project Setup

* `scaffold_project` - Create entire Payload CMS project structures
* `validate_scaffold_options` - Ensure scaffold options follow best practices (used internally by scaffold_project)

<hr>

## 📝 Detailed Tool Reference

### Validation Tools

#### `validate`
Validates Payload CMS code for syntax and best practices.

**Parameters:**
- `code` (string): The code to validate
- `fileType` (enum): Type of file - "collection", "field", "global", or "config"

**Example Prompt:**
```
Can you validate this Payload CMS collection code?

```typescript
export const Posts = {
  slug: 'posts',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    }
  ],
  admin: {
    useAsTitle: 'title',
  }
}
```

#### `query`
Queries validation rules and best practices for Payload CMS.

**Parameters:**
- `query` (string): The query string
- `fileType` (optional enum): Type of file - "collection", "field", "global", or "config"

**Example Prompt:**
```
What are the best practices for implementing access control in Payload CMS collections?
```

#### `mcp_query`
Executes SQL-like queries against Payload CMS structures.

**Parameters:**
- `sql` (string): SQL-like query string

**Example Prompt:**
```
Can you execute this query to find all valid field types in Payload CMS?
SELECT field_types FROM payload_schema WHERE version = '3.0'
```

### Code Generation

#### `generate_template`
Generates code templates for various Payload CMS components.

**Parameters:**
- `templateType` (enum): Type of template - "collection", "field", "global", "config", "access-control", "hook", "endpoint", "plugin", "block", "migration"
- `options` (record): Configuration options for the template

**Example Prompt:**
```
Generate a template for a Payload CMS hook that logs when a document is created.
```

#### `generate_collection`
Generates a complete Payload CMS collection definition.

**Parameters:**
- `slug` (string): Collection slug
- `fields` (optional array): Array of field objects
- `auth` (optional boolean): Whether this is an auth collection
- `timestamps` (optional boolean): Whether to include timestamps
- `admin` (optional object): Admin panel configuration
- `hooks` (optional boolean): Whether to include hooks
- `access` (optional boolean): Whether to include access control
- `versions` (optional boolean): Whether to enable versioning

**Example Prompt:**
```
Generate a Payload CMS collection for a blog with title, content, author, and published date fields. Include timestamps and versioning.
```

#### `generate_field`
Generates a Payload CMS field definition.

**Parameters:**
- `name` (string): Field name
- `type` (string): Field type
- `required` (optional boolean): Whether the field is required
- `unique` (optional boolean): Whether the field should be unique
- `localized` (optional boolean): Whether the field should be localized
- `access` (optional boolean): Whether to include access control
- `admin` (optional object): Admin panel configuration
- `validation` (optional boolean): Whether to include validation
- `defaultValue` (optional any): Default value for the field

**Example Prompt:**
```
Generate a Payload CMS image field with validation that requires alt text and has a description in the admin panel.
```

### Project Setup

#### `scaffold_project`
Scaffolds a complete Payload CMS project structure.

**Parameters:**
- `projectName` (string): Name of the project
- `description` (optional string): Project description
- `serverUrl` (optional string): Server URL
- `database` (optional enum): Database type - "mongodb" or "postgres"
- `auth` (optional boolean): Whether to include authentication
- `admin` (optional object): Admin panel configuration
- `collections` (optional array): Array of collection objects
- `globals` (optional array): Array of global objects
- `blocks` (optional array): Array of block objects
- `plugins` (optional array): Array of plugin strings
- `typescript` (optional boolean): Whether to use TypeScript

**Example Prompt:**
```
Scaffold a Payload CMS project called "blog-platform" with MongoDB, authentication, and collections for posts, categories, and users. Include a global for site settings.
```

<hr>

## 🚀 Getting Started

### 1. Prerequisites

Before you begin, make sure you have:

* Node.js 18+ (required for Payload CMS 3.0)
* An active Railway account
* A Railway API token (create one at [railway.app/account/tokens](https://railway.app/account/tokens))
* Basic familiarity with Payload CMS 3.0 concepts

### 2. Configure Cursor

To use with Cursor IDE:

1. Open Cursor Settings
2. Go to MCP Servers section
3. Add a new MCP server
4. Name it "Payload CMS 3.0 MCP"
5. Set Transport Type to "Command"
6. Set Command to: `railway run --service=YOUR_SERVICE_ID`
7. Save the configuration

### 3. Using the MCP Server

Once configured, you can use these tools in your AI prompts:

* **Code Validation:** "Validate this Payload CMS collection code"
* **Template Generation:** "Generate a template for a media collection"
* **Query Rules:** "Query validation rules for access control"
* **SQL-like Queries:** "Execute a query to find field types for collections"

### 4. Example Workflow

A typical workflow with the Payload CMS MCP Server:

1. Generate a collection template with specific fields
2. Validate the generated code for best practices
3. Query for specific validation rules to improve the code
4. Generate additional components like hooks or endpoints
5. Scaffold a complete project structure when ready

### 5. Complete Workflow Example

Here's a complete example of how you might use the MCP server in a conversation:

```
User: I need to create a Payload CMS collection for a product catalog.

AI: I'll help you create a product catalog collection. Let me generate a template for you.

[Uses generate_collection tool]

Here's a collection template for your product catalog:

```typescript
import { CollectionConfig } from 'payload/types';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'inStock'],
    group: 'Shop',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText',
          type: 'text',
          required: true,
        }
      ]
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
```

User: Can you validate this code to make sure it follows best practices?

AI: I'll validate the code for you.

[Uses validate tool]

The validation results show that your code is valid and follows best practices. Here are a few suggestions:

1. Consider adding a maxDepth to your category relationship field to prevent deep queries
2. You might want to add access control for create, update, and delete operations
3. Consider adding hooks for inventory management when products are updated

User: What are the best practices for access control in Payload CMS?

AI: Let me query the validation rules for access control.

[Uses query tool]

Here are the best practices for access control in Payload CMS:

1. Always define explicit access control functions for create, read, update, and delete operations
2. Use role-based access control for admin users
3. Implement field-level access control for sensitive data
4. Use collection-level access control for broad permissions
5. Consider using hooks alongside access control for complex logic

User: Now I need to scaffold a complete project with this product collection and a categories collection.

AI: I'll scaffold a complete project for you.

[Uses scaffold_project tool]

I've generated a complete Payload CMS project structure with the following:

- Product collection as you specified
- Categories collection with name and description fields
- Media collection for product images
- Authentication for admin users
- TypeScript configuration
- MongoDB database setup
- All necessary files and configurations

The project is ready to be initialized with `npm install` and `npm run dev`.

<hr>

## 📋 Scaffolding Examples & Detailed Prompts

### Project Scaffolding Examples

When you scaffold a project using the MCP server, you'll receive a complete project structure. Here's what a scaffolded e-commerce project might look like:

```
e-commerce-platform/
├── .env
├── .eslintrc.js
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── payload.config.ts
│   ├── server.ts
│   ├── collections/
│   │   ├── Products.ts
│   │   ├── Categories.ts
│   │   ├── Orders.ts
│   │   ├── Customers.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   ├── globals/
│   │   ├── Settings.ts
│   │   └── Footer.ts
│   ├── blocks/
│   │   ├── Hero.ts
│   │   ├── ProductGrid.ts
│   │   └── CallToAction.ts
│   ├── fields/
│   │   ├── richText/
│   │   ├── metaImage.ts
│   │   └── slug.ts
│   ├── hooks/
│   │   ├── beforeChange.ts
│   │   └── afterChange.ts
│   ├── access/
│   │   ├── isAdmin.ts
│   │   └── isAdminOrSelf.ts
│   └── utilities/
│       ├── formatSlug.ts
│       └── sendEmail.ts
```

### Example Scaffold Project Prompt (Basic)

```
Scaffold a Payload CMS project for a blog platform with the following:
- Project name: blog-platform
- Database: MongoDB
- Authentication: Yes
- Collections: Posts, Categories, Authors, Media
- Globals: SiteSettings
- TypeScript: Yes
```

### Example Scaffold Project Prompt (Detailed)

```
Scaffold a comprehensive Payload CMS project for an e-commerce platform with the following specifications:

Project details:
- Name: luxury-watches-store
- Description: "An e-commerce platform for luxury watches"
- Database: PostgreSQL
- TypeScript: Yes

Collections needed:
1. Products collection with:
   - Name (text, required)
   - Description (rich text)
   - Price (number, required)
   - SKU (text, unique)
   - Brand (relationship to Brands collection)
   - Categories (relationship to Categories, multiple)
   - Features (array of text fields)
   - Specifications (array of key-value pairs)
   - Images (array of media uploads with alt text)
   - Stock quantity (number)
   - Status (select: available, out of stock, discontinued)

2. Categories collection with:
   - Name (text, required)
   - Description (rich text)
   - Parent category (self-relationship)
   - Image (media upload)

3. Brands collection with:
   - Name (text, required)
   - Logo (media upload)
   - Description (rich text)
   - Founded year (number)
   - Country of origin (text)

4. Orders collection with:
   - Order number (text, generated)
   - Customer (relationship to Users)
   - Products (array of relationships to Products with quantity)
   - Status (select: pending, processing, shipped, delivered, cancelled)
   - Shipping address (group of fields)
   - Billing address (group of fields)
   - Payment method (select)
   - Total amount (number, calculated)
   - Notes (text)

5. Users collection (auth enabled) with:
   - Email (email, required)
   - Name (text, required)
   - Shipping addresses (array of address groups)
   - Order history (relationship to Orders)
   - Wishlist (relationship to Products)
   - Role (select: customer, admin)

Globals:
1. SiteSettings with:
   - Site name
   - Logo
   - Contact information
   - Social media links
   - SEO defaults

2. ShippingMethods with:
   - Array of shipping options with prices

Include access control for:
- Admin-only access to manage products, categories, brands
- Customer access to their own orders and profile
- Public read access to products and categories

Add hooks for:
- Updating stock when orders are placed
- Generating order numbers
- Sending email notifications on order status changes
```

### Example Collection Creation Prompt (Basic)

```
Generate a Payload CMS collection for blog posts with title, content, author, and published date fields.
```

### Example Collection Creation Prompt (Detailed)

```
Generate a Payload CMS collection for a real estate property listing with the following specifications:

Collection name: Properties
Admin configuration:
- Use "title" as the display field
- Group under "Listings" in the admin panel
- Default columns: title, price, location, status, createdAt

Fields:
1. Title (text, required)
2. Slug (text, unique, generated from title)
3. Description (rich text with basic formatting options)
4. Price (number, required)
5. Location (group) with:
   - Address (text)
   - City (text, required)
   - State/Province (text, required)
   - Postal code (text)
   - Country (select from predefined list)
   - Coordinates (point) for map display
6. Property details (group) with:
   - Property type (select: house, apartment, condo, land, commercial)
   - Bedrooms (number)
   - Bathrooms (number)
   - Square footage (number)
   - Lot size (number)
   - Year built (number)
   - Parking spaces (number)
7. Features (array of checkboxes) including:
   - Air conditioning
   - Swimming pool
   - Garden
   - Garage
   - Fireplace
   - Security system
   - Elevator
   - Furnished
8. Images (array of media uploads with alt text and caption)
9. Documents (array of file uploads for floor plans, certificates, etc.)
10. Status (select: available, under contract, sold, off market)
11. Featured (checkbox to highlight on homepage)
12. Agent (relationship to Users collection, required)
13. Related properties (relationship to self, multiple)

Access control:
- Public read access
- Agent can create and edit their own listings
- Admin can manage all listings

Hooks:
- Before change: Format slug from title
- After change: Notify agent of status changes

Versioning: Enabled
Timestamps: Enabled
```

### Level of Detail in Prompts

The MCP server can handle prompts with varying levels of detail:

#### Minimal Detail (AI fills in the gaps)
```
Generate a collection for blog posts.
```

#### Moderate Detail (Specific requirements)
```
Generate a collection for blog posts with title, content, featured image, categories, and author fields. Make title and content required.
```

#### High Detail (Complete specifications)
```
Generate a collection for blog posts with:
- Slug: posts
- Fields:
  - Title (text, required)
  - Content (rich text with custom formatting options)
  - Featured image (upload with alt text)
  - Categories (relationship to categories collection, multiple)
  - Author (relationship to users collection)
  - Status (select: draft, published, archived)
  - Published date (date)
  - SEO (group with title, description, and keywords)
- Admin configuration:
  - Use title as display field
  - Group under "Content"
  - Default columns: title, author, status, publishedDate
- Access control for different user roles
- Hooks for slug generation and notification
- Enable versioning and timestamps
```

### Tips for Effective Prompts

1. **Be specific about requirements**: The more details you provide, the more tailored the output will be.

2. **Specify relationships**: Clearly indicate how collections relate to each other.

3. **Include validation needs**: Mention any validation rules or constraints for fields.

4. **Describe admin UI preferences**: Specify how you want the collection to appear in the admin panel.

5. **Mention hooks and access control**: If you need specific business logic or security rules, include them in your prompt.

6. **Use domain-specific terminology**: Describe your project using terms relevant to your industry or use case.

<hr>

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

<hr>

## 🌍 About MATMAX WORLDWIDE

<div align="center">
  <h3>MATMAX WORLDWIDE</h3>
  <p>Creating technology that helps humans be more human.</p>
</div>

We believe in tech for good—tools that enhance our lives while respecting our humanity.

Join us in building a future where technology serves wellness, connection, and purpose. Together, we can create digital experiences that bring out the best in us all.

Visit [matmax.world](https://matmax.world) to learn more about our vision for human-centered technology.