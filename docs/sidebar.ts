import type { Config } from 'vocs/config'

export const sidebar = {
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
          text: 'ABIs',
          link: '/api/abis',
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
} satisfies Config['sidebar']
