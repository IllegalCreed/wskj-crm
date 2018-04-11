import api from './config'

export function hello () {
  return api.post('hello', {
  })
}
