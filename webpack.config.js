const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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

  const { paths } = config;

  // 配置 GitHub Pages 的 publicPath
  config.output.publicPath = './yingxiaorili/';

  // 添加 HtmlWebpackPlugin
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: paths.appIndexJs,
      publicPath: './yingxiaorili/'
    })
  );

  // 添加字体文件支持
  config.module.rules.push({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'fonts/', // 相对 output.path 的路径
        publicPath: './yingxiaorili/fonts/'
      }
    }
  });

  return config;
};
