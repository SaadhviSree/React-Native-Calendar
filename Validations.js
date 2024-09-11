const DateValidation = (Str) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!Str.match(regex)) {
    return false
  }

  const parts = Str.split('-')
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1 
  const day = parseInt(parts[2], 10)
  
  const date = new Date(year, month, day)
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return false
  }

  return true
}

const DateRangeValidation = (date1, date2) => {
  const parts1 = date1.split('-')
  const year1 = parseInt(parts1[0], 10)
  const month1 = parseInt(parts1[1], 10) - 1 
  const day1 = parseInt(parts1[2], 10)

  const parts2 = date2.split('-')
  const year2 = parseInt(parts2[0], 10)
  const month2 = parseInt(parts2[1], 10) - 1 
  const day2 = parseInt(parts2[2], 10)

  const dateObj1 = new Date(year1, month1, day1)
  const dateObj2 = new Date(year2, month2, day2)
  
  return dateObj1<=dateObj2
}

const TimeValidation = (time) => {
  const regex = /^\d{2}.\d{2}$/
  if (!time.match(regex)) {
    return false
  }

  const parts = time.split('.')
  const hours = parseInt(parts[0],10)
  const mins = parseInt(parts[1],10)

  if (hours>=0 && hours<=23 && mins>=0 && hours<=59) return true
  return false
}

const TimeRangeValidation = (time1, time2) => {
  const parts1 = time1.split('.')
  const hours1 = parseInt(parts1[0],10)
  const mins1 = parseInt(parts1[1],10)

  const parts2 = time2.split('.')
  const hours2 = parseInt(parts2[0],10)
  const mins2 = parseInt(parts2[1],10)
  console.log(hours1,hours2, hours1<hours2, hours1===hours2, mins1<mins2)
  if (hours1<hours2) return true
  else if (hours1===hours2 && mins1<mins2) return true
  return false
}

export { DateValidation, DateRangeValidation, TimeValidation, TimeRangeValidation }