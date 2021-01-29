import { time } from 'console';
import { Client, Collection, Guild, GuildChannel, GuildMember, Message, MessageEmbed, Role, TextChannel } from 'discord.js';
import minimist from 'minimist';
import { injectable, singleton } from 'tsyringe';
import { Command } from '../core/command';
import { BotLogger } from '../core/logger';

@singleton()
@injectable()
export class Pomodoro implements Command {
    constructor(private logger: BotLogger, private bot: Client) { }
    async handle(cmd: minimist.ParsedArgs, msg: Message): Promise<void> {
        if (!msg.guild) return;

        // minutes
        const workDuration: number = +cmd._[0];
        const breakDuration: number = +cmd._[1];

        let voiceChannel;
        let lastChannelId = 1;
        while (true) {
            voiceChannel = msg.guild.channels.cache.find(c => c.name == `Pomodoro #${lastChannelId}`);
            if (!voiceChannel) {
                // there is no Pomodoro channel for #lastChannelId : we will create it
                break;
            }
            if (voiceChannel?.members.size == 0) {
                // an empty Pomodoro channel already exists for #lastChannelId: we will use it
                break;
            }
            // Pomodoro channel for #lastChannelId is currently used
            lastChannelId++;
        }

        msg.reply(new MessageEmbed()
            .setColor(0x00ff00)
            .setTitle('Pomodoro starting in 10 seconds')
            .addField('Created at (UTC)', new Date().toLocaleString('en-GB', { timeZone: 'UTC' }))
            .addField('Work (min)', workDuration)
            .addField('Break(min)', breakDuration)
            .addField('On channel #', lastChannelId));

        let role = await this.ensureMutedRole(msg.guild);

        if (voiceChannel) {
            this.forbidSpeaking(voiceChannel!, role);
        } else {
            voiceChannel = await msg.guild.channels.create(`Pomodoro #${lastChannelId}`,
                {
                    type: 'voice',
                    permissionOverwrites: [
                        { type: 'role', id: role, deny: ['SPEAK'] },
                        { type: 'role', id: msg.guild.roles.everyone, deny: ['SPEAK'] }
                    ]
                }
            )
        }
        // Wait 10s, so that people get in
        await this.delay(10);

        while (voiceChannel.members.size > 0) {
            // add muted role to everyone and ensure nobody can talk
            await this.forbidSpeaking(voiceChannel!, role)

            // wait work time
            await this.delay(workDuration * 60);

            // if there is nobody anymore we don't need to work anymore
            if (voiceChannel.members.size == 0)
                break;

            // allow talking
            await this.allowSpeaking(voiceChannel, role);
            this.notifyAllowedMembers(voiceChannel.members, <TextChannel> msg.channel)

            // wait break time
            await this.delay(breakDuration * 60);
        }

        await voiceChannel.delete();
    }

    private notifyAllowedMembers(membersChannel: Collection<string, GuildMember>, outputChannel: TextChannel) {
        outputChannel.send(`You can now speak ! ${membersChannel.map(member => member.user).join(', ')}`)
    }

    private async ensureMutedRole(guild: Guild): Promise<Role> {
        let role = guild.roles.cache.find(role => role.name == 'Muted');
        if (!role) role = await guild.roles.create({ data: { name: 'Muted' } })

        return role;
    }

    private async allowSpeaking(voiceChannel: GuildChannel, role: Role) {
        await voiceChannel?.updateOverwrite(voiceChannel.guild.roles.everyone, { SPEAK: true })
        await voiceChannel?.updateOverwrite(role, { SPEAK: true })

        voiceChannel?.members.forEach(async member => {
            await member.voice.setDeaf(false);
            await member.voice.setMute(false);
            await member.roles.remove(role);

        });
    }

    private async forbidSpeaking(voiceChannel: GuildChannel, role: Role) {
        await voiceChannel?.updateOverwrite(voiceChannel.guild.roles.everyone, { SPEAK: false })
        await voiceChannel?.updateOverwrite(role, { SPEAK: false })

        voiceChannel?.members.forEach(async (member) => {
            await member.voice.setDeaf(true);
            await member.voice.setMute(true);
            return await member.roles.add(role);
        });

    }

    private delay(seconds: number) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}