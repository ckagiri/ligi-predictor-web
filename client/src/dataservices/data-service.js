import { Observable } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { of } from 'rxjs/observable/of';
import * as fetchUtils from './fetch-utils';

export const noDelay = source => source;

//'http://localhost:4000'
export class  DataService {
  constructor(
    entityName,
    entitiesUrl,
    entityUrl = entitiesUrl,
    config = { },
    httpClient = fetchUtils.fetchJson) {
    this._name = `${entityName} DataService`;
    this.entityName = entityName;
    const { root = 'http://localhost:3010/api' } = config;
    this.entitiesUrl = `${root}${entitiesUrl}`
    this.entityUrl = `${root}${entityUrl}`
    this.httpClient = httpClient;
  }

  getById(id, params) {
    let err;
    if (id == null) {
      err = new Error(`No "${this.entityName}" id to get`);
    }
    return this.execute('GET_BY_ID', `${this.addSlash(this.entitiesUrl)}` + id, err, params);
  }

  getAll(params, pathSuffix='') {
    const entitiesUrl = this.entitiesUrl + pathSuffix;
    return this.execute('GET_ALL', entitiesUrl, undefined, params);
  }

  getList(params, pathSuffix='') {
    const entitiesUrl = this.entitiesUrl + pathSuffix;
    return this.execute('GET_LIST', entitiesUrl, undefined, params);
  }

  getOne(params, pathSuffix='') {
    const entitiesUrl = this.entitiesUrl + pathSuffix;
    return this.execute('GET_ONE', entitiesUrl, undefined, params);    
  }

  add(entity, params) {
    const entityOrError = entity || new Error(`No "${this.entityName}" entity to add`);
    return this.execute('POST', this.entityUrl, entityOrError, params);
  }

  delete(key, params) {
    let err;
    if (key == null) {
      err = new Error(`No "${this.entityName}" key to delete`);
    }
    return this.execute('DELETE', `${this.addSlash(this.entityUrl)}` + key, err, params)
  }

  update(update, params) {
    const id = update && update.id;
    const updateOrError = id == null ?
      new Error(`No "${this.entityName}" update data or id`) :
      update;
    return this.execute('PUT', `${this.addSlash(this.entityUrl)}` + id, updateOrError, params);
  }

  execute(method, url, data, params) {
    let apiUrl = this.constructUrl(url, params);      
    const options = {};

    if (data instanceof Error) {
      const req = { method, apiUrl, options };
      return this.handleError(req)(data);
    }

    switch (method) {
      case 'GET_ALL':
      case 'GET_LIST':
      case 'GET_BY_ID':
      case 'GET_ONE':
        break;
      case 'DELETE': {
        options.method = 'DELETE';
        break;
      }
      case 'POST': {
        options.method = 'POST';
        options.body = JSON.stringify(data);
        break;
      }
      case 'PUT': {
        options.method = 'PUT';
        options.body = JSON.stringify(data);
        break;
      }
      default:
        throw new Error(`Unsupported fetch action type ${method}`);
    }
    const request = this.httpClient(apiUrl, options).then(response =>
      this.convertHTTPResponse(response, method, data, options)
    );

    return new Observable(subscriber => {
      request.then(response => {
        subscriber.next(response.data);
        subscriber.complete();
      }).catch((err => {
        subscriber.error(err);
        subscriber.complete();
      }));
    });
  }

  addSlash(url) {
    return url && url.indexOf('/', url.length - 1) === -1 ? `${url}/` : url;
  }

  constructUrl(endpoint, parameters) {
    let formatted = endpoint;
    let tokens = parameters;
    let query = {};
    for (let propName in tokens) {
      let propValue = tokens[propName];
      let temp = formatted.replace(':'+propName, propValue);
      if(temp === formatted) {
        query[propName] = propValue;
      }
      formatted = temp;
    }

    let querystring = this.toQueryString(query);
    if(formatted && querystring) {
      if(formatted.indexOf('?') !== -1) {
        formatted = formatted + querystring;
      } else {
        formatted = `${formatted}?${querystring}`;
      }
    }
    return formatted;
  }

  toQueryString(keyValuePair) {
    let queryString = '';
    for (let key in keyValuePair) {
      if (keyValuePair.hasOwnProperty(key)) {
        let value = keyValuePair[key];
        if(queryString) {
          queryString += '&';
        }
        queryString += `${key}=${value}`;
      }
    }
    return queryString;
  }

  handleError(reqData) {
    return (err) => {
      const ok = this.handleDelete404(err, reqData);
      if (ok) { return ok; }
      const error = new Error(err, reqData);
      return new ErrorObservable(error);
    };
  }

  handleDelete404(error, reqData) {
    if (error.status === 404 && reqData.method === 'DELETE' && this.delete404OK) {
      return of({});
    }
    return undefined;
  }

  convertHTTPResponse = (response, method, data, options) => {
    const { headers, json } = response;
    switch (method) {
      case 'GET_LIST':
        if (!headers.has('x-total-count')) {
          throw new Error(
            'The X-Total-Count header is missing in the HTTP Response. The service expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
          );
        }
        return {
          data: json,
          total: parseInt(
            headers
              .get('x-total-count')
              .split('/')
              .pop(),
            10
          ),
        };
      case 'ADD':
        return { data: { ...data, id: json.id } };
      default:
        return { data: json };
    }
  };
}