import { defineConfig, type SchemaTypeDefinition } from 'sanity';
import { structureTool } from 'sanity/structure';
import { seoMetaFields } from 'sanity-plugin-seo';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { isProduction } from '@session/util-js/env';
import { defaultDocumentNode } from './preview';
import logger from './logger';

export type CreateSanityConfigOptions = {
  /** The Sanity project ID. */
  projectId: string;
  /** The dataset name of the Sanity project. */
  dataset: string;
  /** The paths of required endpoints. */
  paths: {
    /** Must match the route of your Sanity Studio instance */
    studio: string;
    /** The path of the enable drafts endpoint. */
    enableDrafts?: string;
    /** The path of the disable drafts endpoint. */
    disableDrafts?: string;
  };
  /** The list of schemas. */
  schemas?: Array<SchemaTypeDefinition>;
  /** The singletons. Schemas that only have a single instance. */
  singletonSchemas?: Array<SchemaTypeDefinition>;
};

// TODO: investigate if we need to add the following actions to the singleton actions
// const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

/**
 * Create a new Sanity config with all the required options.
 * @param projectId - The Sanity project ID.
 * @param dataset - The dataset name of the Sanity project.
 * @param studioBasePath - The base path of the Sanity studio.
 * @param paths - The paths of Sanity endpoints.
 * @param schemas - The schemas.
 * @param singletonSchemas - The singletons.
 */
export function createSanityConfig({
  projectId,
  dataset,
  paths,
  schemas = [],
  singletonSchemas = [],
}: CreateSanityConfigOptions) {
  if (!projectId) {
    throw new TypeError('projectId must be defined');
  }

  if (!dataset) {
    throw new TypeError('dataset must be defined');
  }

  if (!paths) {
    throw new TypeError('paths must be defined');
  }

  let studioBasePath = paths?.studio;
  let disableDraftsPath = paths?.disableDrafts;
  let enableDraftsPath = paths?.enableDrafts;

  if (!studioBasePath) {
    throw new TypeError('paths.studio must be defined to create a Sanity config');
  } else if (!studioBasePath.startsWith('/')) {
    studioBasePath = `/${studioBasePath}`;
  }

  if (!disableDraftsPath) {
    logger.warn('paths.disableDrafts is not defined. Drafts will not be able to be disabled.');
  } else if (!disableDraftsPath.startsWith('/')) {
    disableDraftsPath = `/${disableDraftsPath}`;
  }

  if (!enableDraftsPath) {
    logger.warn('paths.enableDrafts is not defined. Drafts and previewMode will not be enabled.');
  } else if (!enableDraftsPath.startsWith('/')) {
    enableDraftsPath = `/${enableDraftsPath}`;
  }

  if (schemas.length === 0) {
    logger.warn('schemas is empty. No schemas will be created. The Sanity Studio will be empty.');
  }

  logger.info(
    `Creating Sanity config with:\nschemas: (${schemas?.length ?? 0}) ${schemas?.map((schema) => schema.name)}\nsingletonSchemas: (${singletonSchemas?.length ?? 0}) ${singletonSchemas?.map((schema) => schema.name)}\nstudioBasePath: ${studioBasePath}\nenableDraftsPath: ${enableDraftsPath}\ndisableDraftsPath: ${disableDraftsPath}`
  );

  /** Combine the singleton schemas and the regular schemas, removing duplicates. */
  const combinedSchemas = [
    ...singletonSchemas,
    ...schemas.filter(
      (schema) => !singletonSchemas.some((singleton) => singleton.name === schema.name)
    ),
  ];

  return defineConfig({
    basePath: studioBasePath,
    projectId,
    dataset,
    plugins: [
      seoMetaFields(),
      structureTool({
        defaultDocumentNode,
        structure: (S) => {
          const singletonItems = singletonSchemas.map((typeDef) => {
            return S.listItem()
              .title(typeDef.title ?? typeDef.name)
              .icon(typeDef.icon)
              .child(
                S.editor()
                  .id(typeDef.name)
                  .schemaType(typeDef.name)
                  .documentId(typeDef.name)
                  .views([
                    // Default form view
                    S.view.form(),
                    // Preview
                  ])
              );
          });

          // The default root list items (except custom ones)
          const defaultListItems = S.documentTypeListItems().filter(
            (listItem) => !singletonSchemas.find((singleton) => singleton.name === listItem.getId())
          );

          return S.list()
            .title('Content')
            .items([...singletonItems, S.divider(), ...defaultListItems]);
        },
      }),
      presentationTool({
        previewUrl: {
          previewMode: enableDraftsPath
            ? {
                disable: disableDraftsPath,
                enable: enableDraftsPath,
              }
            : undefined,
        },
      }),
      ...(!isProduction() ? [visionTool()] : []),
    ],
    schema: { types: combinedSchemas },
  });
}
