// UserConfig: 允许的配置属性
// ConfigEnv: 运行命令，运行模式
import type { UserConfig, ConfigEnv } from 'vite';

// loadEnv: 加载配置信息
import { loadEnv } from 'vite';
// resolve: 解析路径
import { resolve } from 'path';

// generateModifyVars: 加载基本css变量
import { generateModifyVars } from './build/generate/generateModifyVars';
// createProxy: 根据配置文件的[[string, string]] 获取代理路径
import { createProxy } from './build/vite/proxy';
// wrapperEnv: 校验转化参数并添加到process中
import { wrapperEnv } from './build/utils';
// createVitePlugins: 添加插件
import { createVitePlugins } from './build/vite/plugin';
// OUTPUT_DIR: 打包输出路径
import { OUTPUT_DIR } from './build/constant';

// pkg: 依赖包信息
import pkg from './package.json';
// moment: 时间js库
import moment from 'moment';

// pathResolve: 解析目录
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// 获取pkg下的依赖信息
const { dependencies, devDependencies, name, version } = pkg;
// 构造app信息
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: moment().format('YYYY-MM-DD HH:mm:ss'),
};

// 抛出config
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 获取项目根目录
  const root = process.cwd();
  // 通过运行模式、当前目录加载配置信息
  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  // 判断是否为构建
  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        // ['@vue/compiler-sfc', '@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js'],
      ],
    },
    server: {
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY),
    },
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: createVitePlugins(viteEnv, isBuild),

    optimizeDeps: {
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      include: [
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'moment/dist/locale/zh-cn',
        'ant-design-vue/es/locale/en_US',
        'moment/dist/locale/eu',
      ],
      exclude: ['vue-demi', 'consolidate'],
    },
  };
};
