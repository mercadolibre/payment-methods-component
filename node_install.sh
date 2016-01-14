#!/bin/bash

NVM_VERSION=0.25.4
NODE_VERSION=0.12.5
export NVM_DIR=/usr/local/nvm

if [ -f "${NVM_DIR}/nvm.sh" ]; then
    . ${NVM_DIR}/nvm.sh
    if [ "`nvm --version`" != $NVM_VERSION ]; then
        curl https://raw.githubusercontent.com/creationix/nvm/v$NVM_VERSION/install.sh | bash &&  chmod -R 777 ${NVM_DIR}
        . ${NVM_DIR}/nvm.sh

        nvm install $NODE_VERSION
        nvm alias default $NODE_VERSION
        nvm use default
    fi
else
    curl https://raw.githubusercontent.com/creationix/nvm/v$NVM_VERSION/install.sh | bash &&  chmod -R 777 ${NVM_DIR}
    . ${NVM_DIR}/nvm.sh

    nvm install $NODE_VERSION
    nvm alias default $NODE_VERSION
    nvm use default
fi

gulp=$(npm list -g gulp)
if [ $? -eq 1 ]; then
    echo "Instalando Gulp"
    npm install -g gulp
fi

npmCache=$(npm list -g npm-cache)
if [ $? -eq 1 ]; then
    echo "Instalando npm-cache"
    npm install -g npm-cache
fi
