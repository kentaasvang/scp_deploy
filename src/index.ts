const fs = require("fs");
const core = require("@actions/core");
const exec = require("@actions/exec");
const scp = require("node-scp");

async function run() {
    try {
        // Gather inputs from users or default values
        const host: string = core.getInput('host', { required: true });
        const user: string = core.getInput('user', { required: true });
        const port: string = core.getInput('port') || '22';
        const privateKey: string = core.getInput('private_key', { required: true });
        const sourceFolder: string = core.getInput('source_folder', { required: true });
        const destinationFolder: string = core.getInput('destination_folder', { required: true });

        // SCP Client configuration
        const client = await scp({
            host: host,
            port: port,
            username: user,
            privateKey: privateKey
        });

        // Upload files
        await client.uploadDir(sourceFolder, destinationFolder);

        // Close the SCP connection
        client.close();

        core.info('Files uploaded successfully!');

    } catch (error: any) {
        core.setFailed(error.message);
    }
}

run();
