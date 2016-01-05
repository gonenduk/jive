var config = {
  /**
   * Development
   */
  development: {

    server: {
      port: 3000
    },

    // array of providers
    providers: [
      {
        name: 'prov1',
        bulkSize: 2,
        minFlushRate: 3,
        maxFlushRate: 0
      },
      {
        name: 'prov2',
        bulkSize: 100,
        minFlushRate: 0,
        maxFlushRate: 0
      }
    ]
  },

  /**
   * Production
   */
  production: {

    server: {
      port: 80
    },

    // array of providers
    providers: []
  },

  /**
   * Staging
   */
  staging: {

    server: {
      port: 80
    },

    // array of providers
    providers: []
  }
};

/***
 * Return the right configuration according to NODE_ENV environment variable
 */

module.exports = config[process.env.NODE_ENV || 'development'];
