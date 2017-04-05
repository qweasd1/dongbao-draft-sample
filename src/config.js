/**
 * Created by tony on 4/4/17.
 */

export default undefined

import {addEndPoint} from './plugins/dongbao-plugin-api-axios'
import axios from 'axios'



addEndPoint("default",{
  baseURL:"http://localhost:3567/"
},true)