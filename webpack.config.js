const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@legendapp/motion']
    }
  }, argv);

  // 配置 GitHub Pages 的 publicPath
  if (env.mode === 'production') {
    config.output.publicPath = '/yingxiaorili/';
  }

  return config;
};