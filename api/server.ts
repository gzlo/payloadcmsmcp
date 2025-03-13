import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { validatePayloadCode, queryValidationRules, executeSqlQuery, FileType } from "../lib/payload";

const handler = initializeMcpApiHandler(
  (server) => {
    // Echo tool for testing
    server.tool("echo", { message: z.string() }, async ({ message }) => ({
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    }));

    // Validate Payload CMS code
    server.tool(
      "validate",
      {
        code: z.string(),
        fileType: z.enum(["collection", "field", "global", "config"]),
      },
      async ({ code, fileType }) => {
        const result = validatePayloadCode(code, fileType as FileType);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }
    );

    // Query validation rules
    server.tool(
      "query",
      {
        query: z.string(),
        fileType: z.enum(["collection", "field", "global", "config"]).optional(),
      },
      async ({ query, fileType }) => {
        const rules = queryValidationRules(query, fileType as FileType | undefined);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ rules }, null, 2),
            },
          ],
        };
      }
    );

    // Execute SQL-like query
    server.tool(
      "mcp_query",
      {
        sql: z.string(),
      },
      async ({ sql }) => {
        try {
          const results = executeSqlQuery(sql);
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ results }, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: (error as Error).message }, null, 2),
              },
            ],
          };
        }
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        validate: {
          description: "Validate Payload CMS code",
        },
        query: {
          description: "Query validation rules for Payload CMS",
        },
        mcp_query: {
          description: "Execute SQL-like query against validation rules",
        },
      },
    },
  }
);

export default handler;
