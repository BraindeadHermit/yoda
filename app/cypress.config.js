import { defineConfig } from "cypress";
import webpack from "@cypress/webpack-preprocessor"
import path, {resolve} from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
      const options = webpack.defaultOptions;
      options.webpackOptions.module.rules.push({
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      });
      options.webpackOptions.resolve = {
        extensions: ['.js','.jsx'],
        alias: {
          '@' : resolve (__dirname, "./src"),
        }
      };
      on ("file:preprocessor", webpack(options))
      // Puoi aggiungere ulteriori configurazioni per gli eventi qui
    },
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
