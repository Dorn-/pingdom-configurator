const got = require('got');
const Logger = require('../../utils/logger');
const pkg = require('../../../package.json');

/**
 * Api class connecting to Pingdom API.
 * It's an easy access api class utility.
 */
module.exports = class PingdomApi {
  constructor(config) {
    this.config = config;
    this.logger = new Logger();

    // Set pingdom API
    this.api = got.extend({
      prefixUrl: 'https://api.pingdom.com/api/3.1',
      headers: {
        'User-Agent': `Node/${pkg.name} ${pkg.version} (${pkg.repository.url})`,
        Authorization: `Bearer ${this.config.get('apiToken')}`,
      },
      timeout: 30000,
      retry: {
        limit: 5,
        methods: [
          'GET',
          'PUT',
          'POST',
          'DELETE',
        ],
        statusCodes: [
          401, // @FIXME temporary fix for "JWT-Auth-Only: Unable to decode JWT" bug in Pingdom
          408,
          413,
          429,
          500,
          502,
          503,
          504,
        ],
      },
      responseType: 'json',
    });
  }

  /**
   * Call a 'GET' API request
   */
  async get(url, searchParams = {}) {
    const config = {
      searchParams,
    };

    this.logger.debug(`[pingdom-api] GET ${url}`);

    return await this.api.get(url, config);
  }

  /**
   * Call a 'POST' API request
   */
  async post(url, data = {}, searchParams = {}) {
    const config = {
      searchParams,
      json: data,
    };

    this.logger.debug(`[pingdom-api] POST ${url}`);

    return await this.api.post(url, config);
  }

  /**
   * Call a 'PUT' API request
   */
  async put(url, data = {}, searchParams = {}) {
    const config = {
      searchParams,
      json: data,
    };

    this.logger.debug(`[pingdom-api] PUT ${url}`);

    return await this.api.put(url, config);
  }

  /**
   * Call a 'DELETE' API request
   */
  async delete(url, searchParams = {}) {
    const config = {
      searchParams,
    };

    this.logger.debug(`[pingdom-api] DELETE ${url}`);

    return await this.api.delete(url, config);
  }
};
