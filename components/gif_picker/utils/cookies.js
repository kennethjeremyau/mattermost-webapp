export const setCookie = ({ name, value, exseconds }) => {
  if (typeof document === 'undefined') return

  let expires = ''
  if (exseconds) {
    let d = new Date()
    d.setTime(d.getTime() + exseconds * 1000)
    expires = `expires=${d.toUTCString()};`
  }

  document.cookie = `${name}=${value};${expires}domain=.gfycat.com;path=/;`
}

export const readCookie = name => {
  if (typeof document === 'undefined') return null

  const cname = `${name}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookie = decodedCookie.split(';')
  for (let i = 0; i < cookie.length; i++) {
    let c = cookie[i].trim()
    if (c.indexOf(cname) == 0) {
      return c.substr(cname.length)
    }
  }

  return null
}

export const readAll = () => {
  if (typeof document === 'undefined') return null

  const decodedCookie = decodeURIComponent(document.cookie)
  const cookies = decodedCookie.split(';')

  return cookies.reduce((map, cookie) => {
    let c = cookie.trim().split('=');
    map[c[0]] = c[1]
    return map
  }, {})
}

export const deleteCookie = name => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=.gfycat.com;path=/;';
}

export const deleteAll = () => {
  document.cookie.split(';').map(cookie => {
    let name = cookie.trim().split('=')[0]
    deleteCookie(name)
  })
}