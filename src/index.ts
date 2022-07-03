import core = require("@actions/core");
import github = require("@actions/github");


try 
{
    const host: string = core.getInput("host");
    const user: string = core.getInput("user");
    const password: string = core.getInput("password");

    console.log(`host: ${host}`);
    console.log(`user: ${user}`);
    console.log(`password: ${password}`);
} 
catch (error) 
{
    core.setFailed(error.message); 
}