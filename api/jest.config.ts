module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    globals: {
        'ts-jest': {
            isolatedModules: true, // Speed up the tests by skipping type-checking during tests
        },
    },
}
