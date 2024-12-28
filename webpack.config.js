const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        '@legendapp/motion',
        '@expo/vector-icons',
        'react-native-vector-icons'
      ]
    }
  }, argv);

  // 配置 GitHub Pages 的 publicPath
  config.output.publicPath = '/yingxiaorili/';

  // 添加字体文件支持
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'assets/fonts/',
        publicPath: '/yingxiaorili/assets/fonts/'
      }
    }
  });

  return config;
};
