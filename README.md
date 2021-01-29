# Discord bot pour Nerd Move

## Requirement
Works with node v15.6.0.
## Setup
1. Add token and channel id in .env at the root of the repository
```env
DISCORD_TOKEN=<your token>
DISCORD_CHANNEL_ID=<your channel id>
```
You can find your discord token in the [developer website](https://discord.com/developers/applications)

3. Create invite link with correct permissions and client id (permissions are already set)
Generate the link with https://discordapi.com/permissions.html#24120345 with your correct client id. You can find your client id in the [developer website](https://discord.com/developers/applications)
4. Go on the generated link and invite your bot.
5. Check that you use 2FA
6. Get the channel ID where the bot will talk, by enabling developer mode in Discord settings > Appearance. Once enabled, right click the channel and choose 'Copy id' and paste it in the DISCORD_CHANNEL_ID variable, inside of the .env file
7. Run the bot with 
```bash
    $ npm run start:dev
```

## Testing
You can run tests by executing 
```bash
    $ npm run test
```

## Debugging
You should have access to "Debug" option inside VSCode, when opening the package.json. Click it and choose the command you want to

## Hot-reload
By default, if files change in src/, the bot will restart.

## Logs
You can find logs inside `combined.log`and `error.log`.

## Adding a new command
1. Create a new class in `src/command`.
2. Modify `src/command/commands.ts` by adding your command, and its command name inside the @provider. Example: `{token: 'ping', useClass: Ping}` will create the `/ping` command, and will use the `Ping` class
3. Add your logic inside your class. You can inject almost any singleton/injectable. For example, you can inject `Client` from `discord.js` to interact with channels and all.

## Testing your command
As of now we use mocha, chai and sinon. This needs more work