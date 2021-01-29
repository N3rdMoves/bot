//todo: use setupFiles
import "reflect-metadata";

import { Parser } from '../../core/parse';
import { expect } from 'chai';

describe('Parser', () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser();
  })
  it('should return undefined command and empty args on empty ', () => {
    const [name, args] = parser.parseCommand('');
    expect(name).to.eq(undefined);
    expect(args._).to.be.empty;
  });
  it('should return command name and empty args on missing args ', () => {
    const [name, args] = parser.parseCommand('/toto');
    expect(name).to.eq('toto');
    expect(args._).to.be.empty;
  });

  it('checking named argument', () => { // the single test
    const [name, args] = parser.parseCommand('/toto --abc=3');
    expect(name).to.eq('toto');
    expect(args.__).to.be.undefined;
    expect(args['abc']).to.eq(3);
  });
});