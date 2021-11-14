import { getFormattedNumber } from "./getFormattedNumber";
export function getCoIncentivesString(coIncentives) {
    let string = '';
    coIncentives.forEach((incentive) => {
        if (incentive.text) {
        string += incentive.text + ': ' + getFormattedNumber(incentive.value) + ' ';
        } else {
            string = '-';
        }
    });
    return string;
  }