module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.json'
        }
    },
    collectCoverageFrom: ['./src/**/*.ts'],
    coverageReporters: ['text-summary']
};
