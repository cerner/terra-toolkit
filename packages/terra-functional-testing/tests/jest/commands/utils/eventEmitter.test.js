import eventEmitter from '../../../../src/commands/utils/eventEmitter'; // eslint-disable-line import/no-duplicates
import eventEmitter2 from '../../../../src/commands/utils/eventEmitter'; // eslint-disable-line import/no-duplicates

describe('EventEmitter', () => {
  afterEach(() => {
    eventEmitter.removeAllListeners();
  });

  it('should create event emitter singleton', () => {
    expect(eventEmitter).toEqual(eventEmitter2);
  });

  it('shared singleton instance', () => {
    eventEmitter.on('event-name', () => {});
    eventEmitter2.on('event-name2', () => {});

    expect(eventEmitter.listenerCount('event-name2')).toEqual(1);
    expect(eventEmitter2.listenerCount('event-name')).toEqual(1);
  });
});
