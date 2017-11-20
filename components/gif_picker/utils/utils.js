export const generateUUID = function() {
  let time = new Date().getTime()
  const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (x) => {
    const d = (time + Math.random() * 16) % 16 | 0
    time = Math.floor(time / 16)
    return (x == 'x' ? d : (d & 3 | 8)).toString(16)
  })

  return id
}
