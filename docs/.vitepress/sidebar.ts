import { DefaultTheme } from 'vitepress'

export function getSidebar() {
  return {
    '/': [
      {
        text: 'Guide',
        items: [
          {
            text: 'What is ABIType?',
            link: '/',
          },
          {
            text: 'Getting Started',
            link: '/guide/getting-started',
          },
          {
            text: 'Walkthrough',
            link: '/guide/walkthrough',
          },
          {
            text: 'Comparisons',
            link: '/guide/comparisons',
          },
        ],
      },
      {
        text: 'API',
        items: [
          {
            text: 'Types',
            link: '/api/types',
          },
          {
            text: 'Utilities',
            link: '/api/utilities',
          },
          {
            text: 'Human-Readable',
            link: '/api/human',
          },
          {
            text: 'ABIs',
            link: '/api/abis',
          },
          {
            text: 'Zod',
            link: '/api/zod',
          },
        ],
      },
      {
        text: 'Config',
        items: [
          {
            text: 'Reference',
            link: '/config',
          },
        ],
      },
    ],
  } satisfies DefaultTheme.Sidebar
}
