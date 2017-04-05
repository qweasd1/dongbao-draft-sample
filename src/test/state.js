/**
 * Created by tony on 4/4/17.
 */

import {State} from 'dongbao-state'

export default State({
  dir:__dirname,
  initial:"test value",
  actions:{
    change(state){
      return "test new value"
    }
    
  }
})