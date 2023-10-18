# SCP Deploy GitHub Action

This action allows you to securely transfer files from your GitHub repository to a remote server using the Secure Copy Protocol (SCP).

## Prerequisites

    A remote server with OpenSSH access set up.
    Encrypted key authentication set up on the server (passwords are not supported).
    Ensure the destination folder on the server exists.

## Usage

### Inputs

| Name               | Description                               | Required | Default |
|--------------------|-------------------------------------------|----------|---------|
| `host`             | IP or domain-name of your server.         | Yes      | -       |
| `user`             | Username to connect with.                 | Yes      | -       |
| `port`             | Port for SSH.                             | No       | `22`    |
| `private_key`      | Your SSH private key as a string.         | Yes      | -       |
| `source_folder`    | Directory in your repo to upload.         | Yes      | -       |
| `destination_folder` | Directory on the server to upload files into. | Yes  | -       |


### Example Workflow

```yaml

name: Deploy to Remote Server

on:
  push:
    branches: [ "main" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: SCP Deploy
      uses: kentaasvang/scp_deploy@v2.0.0b
      with:
        host: ${{ secrets.REMOTE_HOST }}
        user: ${{ secrets.REMOTE_USER }}
        private_key: ${{ secrets.REMOTE_SSH_PRIVATE_KEY }}
        source_folder: './path/in/repo'
        destination_folder: '/path/on/server'
```

## Security

Always store sensitive information such as your SSH private keys as GitHub secrets. This action is implemented with security in mind, but always ensure you understand the underlying code and implications before using any GitHub Action.

## License

MIT