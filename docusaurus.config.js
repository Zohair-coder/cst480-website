// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CS T480 - Advanced Web Development',
  tagline: 'Advanced Web Development - Drexel University',
  favicon: 'img/blue-logo.png',

  // Set the production url of your site here
  url: 'https://cst480.zohair.dev/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Zohair-coder', // Usually your GitHub org/user name.
  projectName: 'cst480-website', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
            // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/blue-logo.png',
      navbar: {
        title: 'CS T480 - Advanced Web Development',
        logo: {
          alt: 'My Site Logo',
          src: 'img/blue-logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'syllabusSidebar',
            position: 'left',
            label: 'Syllabus',
          },
          {
            type: 'docSidebar',
            sidebarId: 'activitiesSidebar',
            position: 'left',
            label: 'Activities',
          },
          {
            type: 'docSidebar',
            sidebarId: 'homeworksSidebar',
            position: 'left',
            label: 'Homeworks',
          },
          {
            type: 'docSidebar',
            sidebarId: 'projectSidebar',
            position: 'left',
            label: 'Project',
          },
          {
            type: 'docSidebar',
            sidebarId: 'miscSidebar',
            position: 'left',
            label: 'Misc',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Syllabus',
                to: '/',
              },
              {
                label: 'Activities',
                to: '/activities/Activity 1a/Overview',
              },
              {
                label: 'Homeworks',
                to: '/homeworks/hw1',
              },
              {
                label: 'Project',
                to: '/project/overview',
              },
              {
                label: 'Misc',
                to: '/misc/rest-apis',
              },
            ],
          },
          {
            title: 'Contact',
            items: [
              {
                label: 'nkl43@drexel.edu',
                href: 'mailto:nkl43@drexel.edu',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Source code',
                href: 'https://github.com/Zohair-coder/cst480-website',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Galen Long - Drexel University`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
