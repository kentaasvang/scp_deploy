# SCP deploy

## What it is:

scp_deploy is a [Github-action](https://docs.github.com/en/actions) that handles publishing code to a remote server.

## How to use:

### prerequisites

1. Remote server set up with OpenSSH access, encrypted keys, _not_ password
2. You must provide you private key, preferably through github secrets.
3. destination\_folder specified must exist on remote server as scp\_deploy does not support creating directories.

### Publish files to a remote folder

Create `deploy.yml` in your repo at `.github/workflows/`. This will publish files in _source_folder_ to _destination\_folder_ on remote server. 

Note that with this setup the **destination_folder** must be created before hand. To allow scp_deploy to create files on remote server set **create_folders: true**

```yaml
name: Deploy to Remote Server

# Controls when the workflow will run
on:
  push:
    branches: [ "master" ]
  
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  
  deploy:
    runs-on: ubuntu-latest
    name: Deploys To Server

    steps:
      - name: Publish Files
        uses: kentaasvang/scp_deploy@v0.8.2b
        with:
          host: <hostname>
          user: <username>
          private_key: ${{ secrets.<your_secret_key_name> }}
          source_folder: <name-of-folder-in-repo-to-publish>
          destination_folder: <absolute-path-on-server>
```

---
## Full API

```yaml
host:
    description: "The IP or domain-name of your server"
    required: true
user: 
    description: "The username to connect with"
    required: true
port: 
    description: "Port to use with your connection"
    required: false
    default: 22
private_key:
    description: "Your private key as string"
    required: true
    default: ""

source_folder:
    description: "Directory to upload"
    required: true
destination_folder:
    description: "Directory to upload files into"
    required: true
    versioning:
```