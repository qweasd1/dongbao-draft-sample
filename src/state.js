/**
 * Created by tony on 4/3/17.
 */
import {State} from 'dongbao'
import {api,get,post,del} from './plugins/dongbao-plugin-api-axios'


export default State({
  dir: __dirname,
  initial: {
    counter: 0,
    isInProgress: false,
    hasError: false,
    posts: [],
    error: null,
    findPost:{}
  },
  plugins: [
    api()
  ],
  actions: {
    increase(state){
      return {
        ...state,
        counter: state.counter + 1
      }
    },
    decrease(state){
      return {
        ...state,
        counter: state.counter - 1
      }
    },
    setInProgress(state, isInProgress){
      if (isInProgress === state.isInProgress) {
        return state
      }
      else {
        return {
          ...state,
          isInProgress: isInProgress
        }
      }
    },
    fetchPostsStart(state,payload){
      return state
    },
    fetchPostsEnd(state, payload, error){
      return {
        ...state,
        hasError: !!error,
        isInProgress: false,
        posts: payload
      }
    },
    findPostByIdEnd(state, payload,error){
      return {
        ...state,
        findPost:payload
      }
    },
    addPostEnd(state,payload){
      return state
    }
  },
  effects: {
    asyncIncrease(){
      this.setInProgress(true)
      setTimeout(() => {
        this.increase()
        this.setInProgress(false)
      }, 500)
      
    },
    fetchPosts:get("posts"),
    findPostById:get("posts/{id}"),
    addPost:post("posts"),
    
  }
})