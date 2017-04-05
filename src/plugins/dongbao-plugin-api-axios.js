/**
 * Created by tony on 4/4/17.
 */

import axios from 'axios'

const PATH_VARIABLE_PATTERN = /\{(\w+)\}/g

const NOOP = () => {
}

const DEFAULT_AFTER_ACTION = (payload,error)=>{
  //do nothing here
  console.log("default after action:",payload,error);
  console.warn("you should implement after action to handle web api's result")
}

function createGetRequestConfig(payload, config) {
  config.params = payload
  return config
}

function createDeletePutPatchPostRequestConfig(payload,config) {
  config.data = payload
  return config
}

function createOtherRequestConfig(payload,config) {
  return config
}

function popParamsToUrlPath(payload,url) {
  let removeParams = []
  let resolvedUrl = url.replace(PATH_VARIABLE_PATTERN,function(match,varialbe){
    if (varialbe in payload) {
      removeParams.push(varialbe)
      return payload[varialbe]
    }
    else {
      throw new Error(`payload has no value for ${varialbe} for url: ${url}`)
    }
  })
  
  removeParams.forEach((name)=>{
    delete payload[name]
  })
  
  return resolvedUrl
}

const DEFAULT_CREATE_REQUEST_CONFIG = {
  "get":createGetRequestConfig,
  "put":createDeletePutPatchPostRequestConfig,
  "patch":createDeletePutPatchPostRequestConfig,
  "post":createDeletePutPatchPostRequestConfig,
  "delete":createDeletePutPatchPostRequestConfig,
  "head":createOtherRequestConfig,
  "options":createOtherRequestConfig,
}

const PLUGIN_NAME = "api-axios"
let globalDefaultEndpoint = undefined

// store api endpoints for different baseUrl
export let endpoints = {
  //name: axios(baseUrl)
}

// init functions
export function addEndPoint(name, axiosConfig, isDefault) {
  endpoints[name] = axios.create(axiosConfig)
  
  console.log(axiosConfig, endpoints[name]);
  
  if (!globalDefaultEndpoint) {
    globalDefaultEndpoint = name
  }
  
  if (isDefault) {
    globalDefaultEndpoint = name
  }
}

// config functions
class apiConfig {
  constructor(method, url) {
    // mark this object as plugin object, so your plugin processing function will catch it
    this.$plugin = PLUGIN_NAME
    this.requestConfig = {
      method,
      url
    }
    this.createRequestConfig = DEFAULT_CREATE_REQUEST_CONFIG[method]
  }
  
  /**
   * this will make the http request dynamically config its params, data, headers from current state
   * @param configFn (payload,requestConfig):requestConfig
   */
  config(configFn) {
    this.createRequestConfig = configFn
    return this
  }
  
  from(endpoint) {
    this.endpoint = endpoint
  }
  
  to(endpoint) {
    this.endpoint = endpoint
  }
}

// helper methods to create restful api config
export function get(url) {
  return new apiConfig("get", url)
}

export function post(url) {
  return new apiConfig("post", url)
}

export function del(url) {
  return new apiConfig("delete", url)
}

export function put(url) {
  return new apiConfig("put", url)
}

export function patch(url) {
  return new apiConfig("patch", url)
}

export function head(url) {
  return new apiConfig("head", url)
}

export function options(url) {
  return new apiConfig("options", url)
}

// config function


export function api({endpoint:defaultEndpoint}={}) {
  return function ({effects}) {
    for (let name in effects) {
      let effectConfig = effects[name]
      if (effectConfig.$plugin === PLUGIN_NAME) {
        
        let endpoint = endpoints[effectConfig.endpoint || defaultEndpoint || globalDefaultEndpoint]
        let createRequestConfig = effectConfig.createRequestConfig
        let requestConfigTemplate = effectConfig.requestConfig
        
        let startActionName = name + "Start"
        let endActionName = name + "End"
        
        
        function effectFn(payload, getState) {
          // we clone the requestConfig each time, so no side effect to the original config
          let requestConfig = {...requestConfigTemplate}
          
          // replace url variable from payload (these variables also deleted from payload)
          requestConfig.url = popParamsToUrlPath(payload,requestConfig.url)
          requestConfig = createRequestConfig(payload, requestConfig)
          
          // wrap the result of the 'start' action in promise
          let startAction = this[startActionName] || NOOP
          let endAction = this[endActionName] || DEFAULT_AFTER_ACTION
          return Promise.resolve(startAction(payload)).then(() => {
            return endpoint.request(requestConfig).then(({data}) => {
              return endAction(data)
            }).catch((err) => {
              return endAction(err, true)
            })
          })
        }
        
        effects[name] = effectFn
      }
      
    }
  }
}