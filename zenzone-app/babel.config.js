module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@assets": "./assets",
            "@hooks": "./app/hooks",
            "@navigations": "./app/navigations",
            "@context": "./app/context",
            "@utils": "./app/utils",
            "@screens": "./app/screens",
            "@helpers": "./app/helpers",
            "@constants": "./app/constants",
            "@elements": "./app/elements",
            "@redux": "./app/redux",
            "@shared": "./app/shared",
            "@graphql": "./app/graphql",
            "@components": "./app/components",
            "@camera": "./app/camera",
          },
        },
      ],
      [
        "react-native-reanimated/plugin",
        {
          globals: ["__scanFaces"],
        },
      ],
    ],
  };
};
