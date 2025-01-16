module.exports = {
    module: {
      rules: [
        {
          test: /\.jsx?$/, // Regola per i file .js e .jsx
          exclude: /node_modules/, // Esclude la cartella node_modules
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'], // Aggiunge il preset per React
            },
          },
        },
      ],
    },
  };
  