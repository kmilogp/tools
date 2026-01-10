import http from 'k6/http'

export const options = {
  vus: 3000,
  iterations: 6000
}

export default function () {
  http.get('https://tools.kmilo.dev')
}
