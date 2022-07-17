# SCP deploy

## What it is:

scp_deploy is a [Github-action](https://docs.github.com/en/actions) that handles publishing code to a remote server.
You can publish files to a specified folder with the option to use versioning and retain older versions of your builds on the remote server for fast access. 
scp_deploy also supports creating symlinks when publishing new versions which i.e can be used to update the content of your web server.

## How to use:

### prerequisites

1. Remote server set up with OpenSSH access, encrypted keys, _not_ password
2. You must provide you private key, preferably through github secrets

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
          # private_key if set up in github secrets
          private_key: ${{ secrets.<your_secret_key_name> }}
          source_folder: <name-of-folder-in-repo-to-publish>
          destination_folder: <absolute-path-on-server>
          create_folders: false
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
description: "publish new deploys in folders with a build number representing it's version. (newer versions get higher build number)"
    required: false
    default: false
public_directory:
    description: "Public folder accessable from webclient"
    required: false
    default: "Current"
create_folders: 
    description: "Create directories on server if it does not exist"
    required: false
    default: false
create_symlink:
    description: "Create a symbolic link from newest version to public directory, required that public directory is set"
    required: false
    default: false
```