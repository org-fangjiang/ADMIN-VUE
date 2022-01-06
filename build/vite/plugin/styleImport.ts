/**
 *  Introduces component library styles on demand.
 * https://github.com/anncwb/vite-plugin-style-import
 */

import styleImport from 'vite-plugin-style-import';
// ant-design-vue 找不到style
export function configStyleImportPlugin(isBuild: boolean) {
  if (!isBuild) return [];
  const styleImportPlugin = styleImport({
    libs: [
      {
        libraryName: 'ant-design-vue',
        esModule: true,
        resolveStyle: (name) => {
          const item = [
            'input-search',
            'menu-item',
            'form-item',
            'input-password',
            'textarea',
            'radio-group',
            'select-option',
            'tab-pane',
            'timeline-item',
          ];
          if (item.includes(name)) {
            return '';
          }
          return `ant-design-vue/es/${name}/style/index`;
        },
      },
    ],
  });
  return styleImportPlugin;
}
