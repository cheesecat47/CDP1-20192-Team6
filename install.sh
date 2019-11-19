#! /bin/bash

cdp1=`pwd`
dev_app=$cdp1/dev/app

echo '2019-2 Capstone Design Project 1'
echo 'School of Computer Science and Engineering, Kyungpook National University.'
echo 'Blockchain used market service using Ethereum.'


os_info=`cat /etc/issue`
if [[ "$os_info" == *"Ubuntu 18.04"* ]]; then
    echo -e '\nCurrent OS: Ubuntu 18.04\n'
else
    echo -e '\nPlease run in Ubuntu 18.04\n'
    exit
fi


# Update first.
sudo apt update


echo -e '\n#####\n#####\tInstall nodejs\n#####'
sudo apt install nodejs
cd $dev_app
sudo npm -y install


echo -e '\n#####\n#####\tInstall ganache-cli\n#####'
sudo npm -y install ganache-cli


echo -e '\n#####\n#####\tInstall truffle\n#####'
sudo npm -y install -g truffle


echo -e '\n#####\n#####\tInstall ipfs\n#####'
cd ~
git clone https://github.com/ipfs-shipyard/ipfs-desktop.git
cd ipfs-desktop
sudo npm -y install -g npx
sudo npm -y install

rm -rf ~/.ipfs
ipfs init

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'


echo -e '\n#####\n#####\tInstall MongoDB\n#####'
cd ~
sudo apt install -y mongodb
sudo mkdir -p /data/db


echo -e '\n#####\n#####\tInstall Metamask\n#####'
echo -e '#####\tPlease install Metamask manually.'
echo -e '#####\tThis is an extension of Chrome browser.'
echo -e '#####\thttps://metamask.io'
echo -e '#####'