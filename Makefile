export http_proxy=http://172.16.0.89:80
export https_proxy=http://172.16.0.89:80
export no_proxy=swift.melicloud.com
export NVM_DIR=/usr/local/nvm

NODE_VERSION=0.12.5

meli-install:
	@chmod 777 node_install.sh
	sh node_install.sh
meli-test:

meli-build:
	. ${NVM_DIR}/nvm.sh && nvm use $(NODE_VERSION) && npm-cache install npm && gulp build && gulp dist && gulp uploadStatics --version $(VERSION)

	@mkdir ml-build
	@touch ml-build/ml-build-finish.txt
