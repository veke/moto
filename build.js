({
    mainConfigFile : 'requireConfig.js',
    baseUrl: '.',
    removeCombined: true,
    findNestedDependencies: true,
    dir: 'dist',
    modules: [
        {
            name: 'src/App'
        }
    ],
    fileExclusionRegExp: /^node_modules/,
})
