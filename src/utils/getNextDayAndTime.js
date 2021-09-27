//Get next weekDay
export function getNextDayAndTime(dayOfWeek, hour, minute) {
    var now = new Date()
    var result = new Date(
                   now.getFullYear(),
                   now.getMonth(),
                   now.getDate() + (7 + dayOfWeek - now.getDay()) % 7,
                   hour,
                   minute)
  
    if (result < now)
      result.setDate(result.getDate() + 7)
      result = result.getTime();
    
    return result
  }