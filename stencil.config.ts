import { Config } from '@stencil/core'

export const config: Config = {
  namespace: 'ui-directory',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
      footer: '©2025 cgoern',
    },
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
}
