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

  // 添加字体文件支持
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'fonts/'
      }
    }
  });

  return config;
};