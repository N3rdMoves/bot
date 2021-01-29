//todo: use setupFiles
import "reflect-metadata";

import { expect } from 'chai';
import { BotMessageController } from '../../../src/core/controller';
import { BotConfig } from "../../core/model/config";
import { Parser } from "../../core/parse";
import { BotLogger } from "../../core/logger";
import MockDiscord from "../mocks.spec";
import { Client } from "discord.js";
import { container } from "tsyringe";
import { Command } from "../../core/command";
import sinonChai from "sinon-chai";
import { Ping} from '../../command/ping';
import * as sinon from 'sinon';
import * as chai from 'chai';

chai.should()
chai.use(sinonChai);

describe('BotMessageController', () => {
    let mock: MockDiscord;
    let client: Client;
    let cmdStub: sinon.SinonStubbedInstance<Command>;

    beforeEach(() => {
        mock = new MockDiscord();
        client = mock.getClient();
    });

    it("given registered command, when receiving msg to it, controller should call its handle", () => {
        // GIVEN
        cmdStub = sinon.createStubInstance(Ping, {handle: sinon.stub()});
        container.register<Command>('ping', {useValue: cmdStub});

        const config = new BotConfig(undefined, '/');
        const controller = new BotMessageController(config, client, new Parser(), new BotLogger());

        // WHEN
        mock.message.content = '/ping';
        controller.onMessage(mock.message);

        // THEN
        cmdStub.handle.should.have.been.called;
    });

    it("given failing command, when receiving msg to it, controller should call its handle and catch error", () => {
        // GIVEN
        cmdStub = sinon.createStubInstance(Ping, {handle: <any> sinon.stub().throws()});
        container.register<Command>('ping', {useValue: cmdStub});

        const config = new BotConfig(undefined, '/');
        const controller = new BotMessageController(config, client, new Parser(), new BotLogger());

        // WHEN
        mock.message.content = '/ping';
        controller.onMessage(mock.message);

        // THEN
        cmdStub.handle.should.have.been.called;
    });
});