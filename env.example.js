const environmentTypes = {
  production: {
    baseURL: '',
    bundleIdentifier: 'silvi.asia',
    dataLimit: 10,
    deepLinkingHost: 'https://www.silvi.asia',
    deepLinkingScheme: 'silvi://',
    facebookAppId: '965784094060632',
    facebookClientToken: 'b85d1a094bdd72816d4aa36dcefe8366',
    googleAndroidClientId:
      '745093941879-5fj6t92jikaua639d63p50is6rcu2rm5.apps.googleusercontent.com',
    googleIOSClientId: '',
    googleMapsAPIKey: '',
    googleWebClientId:
      '745093941879-0tbl0vgp5gcjq68o5sjlgc9rma3cp9nt.apps.googleusercontent.com',
    versionCode: 1,
    versionNumber: '1.0',
  },
  staging: {
    baseURL: 'https://api.silvi.asia/v1/',
    bundleIdentifier: 'staging.silvi.asia',
    dataLimit: 10,
    deepLinkingHost: 'https://www.silvi.asia',
    deepLinkingScheme: 'silvi://',
    facebookAppId: '1041286436736896',
    facebookClientToken: '0d434f238aa6a076c59389728b9f86b2',
    // For Release AAB
    // googleAndroidClientId:
    //   '96388230449-123ot4lhc4366kkmuj0tpqfkh7jtp4hv.apps.googleusercontent.com',
    // For Release APK
    googleAndroidClientId:
      '96388230449-onns8tclvm11lethe6pkpbisb5isorm8.apps.googleusercontent.com',
    googleIOSClientId: '',
    googleMapsAPIKey: 'AIzaSyDEneGK4ufgrqR9qE2FnNYFynEVfovp5pU',
    googleWebClientId:
      '96388230449-ja38tv13og0pqksn2hirruhoaa8a9ntj.apps.googleusercontent.com',
    versionCode: 14,
    versionNumber: '1.13',
  },
  development: {
    baseURL: 'http://34.237.45.73:3000/v1/',
    bundleIdentifier: 'development.silvi.asia',
    dataLimit: 10,
    deepLinkingHost: 'https://www.silvi.asia',
    deepLinkingScheme: 'silvi://',
    facebookAppId: '1652642161746188',
    facebookClientToken: '4d48415da813eefc6006ea566e346b1b',
    googleAndroidClientId:
      '23246356866-0o8n8skbl486dc1nemlokrkg59tfmu6n.apps.googleusercontent.com',
    googleIOSClientId: '',
    googleMapsAPIKey: 'AIzaSyAFLsb86lhliNoSabTccZs1vY7ZP6l0rE8',
    googleWebClientId:
      '23246356866-il96jt81h6lbcp65f4gg0s757cp56rle.apps.googleusercontent.com',
    versionCode: 1,
    versionNumber: '1.0',
  },
};

const setEnvironment = () => {
  // Insert Current Platform (e.g. development, production, staging, etc)
  const environment = 'staging';

  return {...environmentTypes[environment], currentEnvironment: environment};
};

const currentEnvironment = setEnvironment();

module.exports = currentEnvironment;
