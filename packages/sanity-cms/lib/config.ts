import { defineConfig, type SchemaTypeDefinition } from 'sanity';
import { structureTool } from 'sanity/structure';
import { seoMetaFields } from 'sanity-plugin-seo';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { isProduction } from '@session/util-js/env';
import { defaultDocumentNode } from './preview';

export type CreateSanityConfigOptions = {
  projectId: string;
  dataset: string;
  /** Must match the route of your Studio */
  studioBasePath: string;
  appUrl: string;
  paths: {
    enableDrafts: string;
    disableDrafts: string;
  };
  schema?: Array<SchemaTypeDefinition>;
};

/**
 * Create a new Sanity config with all the required options.
 * @param projectId - The Sanity project ID.
 * @param dataset - The dataset name of the Sanity project.
 * @param studioBasePath - The base path of the Sanity studio.
 * @param paths - The paths of the enable and disable drafts endpoints.
 */
export function createSanityConfig({
  projectId,
  dataset,
  studioBasePath,
  paths,
  appUrl,
  schema = [],
}: CreateSanityConfigOptions) {
  if (!studioBasePath || !studioBasePath.startsWith('/')) {
    throw new TypeError('studioBasePath must be a non-empty string starting with a forward slash');
  }

  return defineConfig({
    basePath: studioBasePath,
    projectId,
    dataset,
    plugins: [
      seoMetaFields(),
      structureTool({
        defaultDocumentNode,
      }),
      presentationTool({
        previewUrl: {
          origin: appUrl,
          previewMode: {
            enable: paths.enableDrafts,
            disable: paths.disableDrafts,
          },
        },
      }),
      ...(!isProduction() ? [visionTool()] : []),
    ],
    schema: { types: schema },
  });
}
