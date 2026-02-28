const sonarqubeScanner = require('sonarqube-scanner').default;
sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    token: 'sqp_0c5909a78eae322281ee4e7dfe3036f1e0a76091', 
    options: {
      'sonar.projectKey': 'inge', 
      'sonar.sources': '.',
      'sonar.exclusions': 'node_modules/**, __tests__/**, coverage/**', 
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info' 
    }
  },
  () => console.log('Escaneo de SonarQube completado')
);