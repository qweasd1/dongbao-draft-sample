/**
 * Created by tony on 4/3/17.
 */
import React, { Component } from 'react';
import {Actions,connect} from 'dongbao'
import state from './state'
import testState from './test/state'





class Counter extends Component{
  render(){
    return (
      <div>
        <div>
          <button onClick={()=>{state.fetchPosts()}}>fetch posts</button>
          <button onClick={()=>{state.findPostById({id:2})}}>find post by id</button>
          <button onClick={()=>{state.addPost({title:"something",author:"other"})}}>add post</button>
        </div>
        {
          this.props.state.isInProgress ? undefined : this.props.state.posts.map(post => (<p key={post.id}>{post.title}</p>))
        }
        
        <div>
          <p>find post by id</p>
          <p>{this.props.state.findPost.title}</p>
        </div>
        
        <p>{this.props.state.counter}</p>
        {this.props.state.isInProgress? <p>in process...</p> : null}
        <button onClick={
          ()=>{
            state.increase()
          }
        }>+</button>
        <button onClick={
        ()=>{
          state.decrease()
        }
        }>-</button>
  
        <button onClick={
          ()=>{
            Actions.asyncIncrease()
          }
        }>aysnc+</button>
      </div>
      
      
    )
  }
}

Counter.propTypes = {
  state:React.PropTypes.object
}

export default connect({
  dir:__dirname,
  states:[".","./test"],
  map(state, test){
    
    return {
      state:state,
      testValue:test
    }
  }
})(Counter)

