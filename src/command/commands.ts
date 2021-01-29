import { registry } from "tsyringe";
import { Ping } from "./ping";
import { Pomodoro } from "./pomodoro";

@registry([
    {token: 'ping', useClass: Ping},
    // add new commands here
    {token: 'pomodoro', useClass: Pomodoro},
])
export class Commands {
    
}