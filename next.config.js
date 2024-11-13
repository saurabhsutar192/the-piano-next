module.exports = {
  optimizeFonts: false,
  module: {
    rules: [
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};
