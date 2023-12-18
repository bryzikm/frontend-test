import { DurationPipe } from './duration.pipe';

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
const HOURS_IN_MILLISECONDS = 1000 * 60 * 60;
const MINUTES_IN_MILLISECONDS = 1000 * 60;

describe('DurationPipe', () => {
  const pipe = new DurationPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format 1 day duration', () => {
    expect(pipe.transform(DAY_IN_MILLISECONDS)).toEqual('1 day');
  });

  it('should format 2 days, 2 hours and 2 minutes duration', () => {
    expect(
      pipe.transform(
        2 * DAY_IN_MILLISECONDS +
          2 * HOURS_IN_MILLISECONDS +
          2 * MINUTES_IN_MILLISECONDS,
      ),
    ).toEqual('2 days, 2 hours, 2 minutes');
  });

  it('should return empty string', () => {
    expect(pipe.transform(0)).toEqual('');
  });
});
