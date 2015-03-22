({
    mainConfigFile : 'js/main.js',
    baseUrl: '.',
    removeCombined: true,
    findNestedDependencies: true,
    dir: 'dist',
    keepBuildDir: false,
    optimize: 'none',
    fileExclusionRegExp: /^\.|node_modules|build.js|gulpfile.js|README.md|bower.json|package.json/,
    modules: [
        {
            name: 'js/App'
        }
    ]
})
