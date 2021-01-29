//todo: use setupFiles
import "reflect-metadata";

import { BotMessageController } from '../../../src/core/controller';
import { BotConfig } from "../../core/model/config";
import { Parser } from "../../core/parse";
import { BotLogger } from "../../core/logger";
import MockDiscord from "../mocks.spec";
import { Client } from "discord.js";
import { container } from "tsyringe";
import { Command } from "../../core/command";
import sinonChai from "sinon-chai";
import { Pomodoro } from '../../command/pomodoro';
import * as sinon from 'sinon';
import * as chai from 'chai';
import minimist from "minimist";

chai.should()
chai.use(sinonChai);

describe('BotMessageController', () => {
    let mock: MockDiscord;
    let client: Client;

    beforeEach(() => {
        mock = new MockDiscord();
        client = mock.getClient();
    });

    it("given '/pomodoro 20 3' command, when receiving msg to it, controller should call its handle", () => {
        // GIVEN
        let command = new Pomodoro(new BotLogger(), client);
        let reply = sinon.spy(mock.message, 'reply');
        // WHEN
        mock.message.content = '/pomodoro';
        command.handle(minimist(['20', '3']), mock.message);
        // THEN
        reply.should.have.been.called;

        //TODO: test
    });

});