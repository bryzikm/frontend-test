import { Pipe, PipeTransform } from '@angular/core';

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const HOURS_IN_MILLISECONDS = 1000 * 60 * 60;
const MINUTES_IN_MILLISECONDS = 1000 * 60;

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    const days = Math.floor(value / DAY_IN_MILLISECONDS);
    const daysString = this.getFormattedString(days, 'day');

    const restHours = value % DAY_IN_MILLISECONDS;
    const hours = Math.floor(restHours / HOURS_IN_MILLISECONDS);
    const hoursString = this.getFormattedString(hours, 'hour');

    const restMinutes = restHours % HOURS_IN_MILLISECONDS;
    const minutes = Math.floor(restMinutes / MINUTES_IN_MILLISECONDS);
    const minutesString = this.getFormattedString(minutes, 'minute');

    return [daysString, hoursString, minutesString]
      .filter((value) => !!value)
      .join(', ');
  }

  private getFormattedString(value: number, unit: string): string {
    if (!value) {
      return '';
    }

    return `${value} ${unit}${value > 1 ? 's' : ''}`;
  }
}
