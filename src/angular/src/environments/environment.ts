import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4201';

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'WebBase',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:5101/',
    redirectUri: baseUrl,
    clientId: 'WebBase_App',
    responseType: 'code',
    scope: 'offline_access WebBase',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:5102',
      rootNamespace: 'WebBase',
    },
  },
} as Environment;
