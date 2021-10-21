export function getFormattedNumber(x) {
    if (isFinite(x)) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
    return '\u221e';
    }
  }