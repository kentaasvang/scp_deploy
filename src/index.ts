const fs = require("fs");
const core = require("@actions/core");
const exec = require("@actions/exec");

async function run() {
    try {
        // Gather inputs from users or default values
        const host: string = core.getInput('host', { required: true });
        const user: string = core.getInput('user', { required: true });
        const port: string = core.getInput('port') || '22';
        const privateKey: string = core.getInput('private_key', { required: true });
        const sourceFolder: string = core.getInput('source_folder', { required: true });
        const destinationFolder: string = core.getInput('destination_folder', { required: true });

        // Write private key to a temporary file for SCP
        const keyPath: string = '/tmp/deploy_key';
        fs.writeFileSync(keyPath, privateKey);
        fs.chmodSync(keyPath, '600'); // Set required permissions

        // SCP Command
        const scpCommand: string = `scp -i ${keyPath} -P ${port} -r ${sourceFolder} ${user}@${host}:${destinationFolder}`;
        
        // Execute SCP
        await exec.exec(scpCommand);

    } catch (error: any) {
        core.setFailed(error.message);
    }
}

run();
