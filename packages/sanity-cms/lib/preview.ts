import { type DefaultDocumentNodeResolver } from 'sanity/structure';
import { Iframe } from 'sanity-plugin-iframe-pane';
import type { RouteFieldsSchemaType } from '../schemas/fields/groups/route';
import { DeadLinks, Preflight } from '@planetary/sanity-plugin-preflight';
import { DesktopIcon, EditIcon, RocketIcon } from '@sanity/icons';

const iframeDefaultOptions = {
  url: {
    origin: 'same-origin',
    preview: (document: RouteFieldsSchemaType) =>
      document?.slug?.current ?? new Error('Missing slug'),
    draftMode: '/api/draft/enable', // the route you enable draft mode, see: https://github.com/sanity-io/visual-editing/tree/main/packages/preview-url-secret#sanitypreview-url-secret
  },
  showDisplayUrl: true,
  defaultSize: `desktop`,
  reload: {
    button: true,
  },
};

// Import this into the deskTool() plugin
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) =>
  S.document().views([
    S.view.form().icon(EditIcon),
    S.view
      .component(Iframe)
      .options({
        ...iframeDefaultOptions,
        defaultSize: `desktop`,
      })
      .title('Preview')
      .icon(DesktopIcon),
    S.view
      .component(
        Preflight({
          plugins: [DeadLinks()],
        })
      )
      .title('Preflight')
      .icon(RocketIcon),
  ]);
