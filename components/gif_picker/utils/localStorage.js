import { readCookie, setCookie, readAll, deleteAll } from './cookies'


/**
 *  Attempt to retrieve state object from browser's local storage
 */
export const load = (key, type = 'local') => {
  try {
    const storage = type === 'local' ? localStorage : sessionStorage
    let serializedValue = storage.getItem(key)
    if (typeof serializedValue === 'object') {
      return JSON.parse(serializedValue)
    }
    if (serializedValue === null) serializedValue = readCookie(key)
    return serializedValue === null ? undefined : serializedValue
  } catch (err) {
    return undefined
  }
}

export const loadAll = (type = 'local') => {
  try {
    const storage = type === 'local' ? localStorage : sessionStorage
    let keys = Object.keys(storage)
    let storageMap = Object.keys(storage).reduce( (map, key) => {
      map[key] = load(key, type)
      return map
    }, {})
    if (!Object.keys(storageMap).length) {
      storageMap = readAll()
    }
    return storageMap
  } catch (err) {
    console.error('Error reading storage')
    return undefined
  }
}

export const set = (key, value, type = 'local') => {
  try {
    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : value
    
    if (typeof localStorage !== undefined && type === 'local') {
      localStorage.setItem(key, serializedValue)
    } else if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, serializedValue)
    }
  } catch (err) {
    setCookie({name: key, value})
    //Ignore write errors
    //TODO: log errors
    console.error('Error setting browser storage', err)
  }
}

export const setAll = (map, type = 'local') => {
  try {
    Object.keys(map).forEach(key => {
      if (map[key]) set(key, map[key], type)
    })
  } catch (err) {
    console.error('Error setting browser storage', err)
  }
}

export const clear = ( type = 'local' ) => {
  try {
    //const storage = type === 'local' ? localStorage : sessionStorage
    localStorage.clear()
    sessionStorage.clear()
    deleteAll()
  } catch (err) {
    console.error('Error clearing browser storage', err)
  }
}
