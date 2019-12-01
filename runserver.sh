#! /bin/bash

# Request root privilege
[ "$UID" -eq 0 ] || exec sudo "$0" "$@"

cdp1=`pwd`
dev=$cdp1/dev
dev_app=$dev/app
dev_src=$dev_app/src

printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line

echo -e '2019-2 Capstone Design Project 1'
echo -e 'School of Computer Science and Engineering, Kyungpook National University.'
echo -e 'Blockchain used market service using Ethereum.'
echo -e 'Run server...'


os_info=`cat /etc/issue`
if [[ "$os_info" == *"Ubuntu 18.04"* ]]; then
    echo -e '\nCurrent OS: Ubuntu 18.04\n'
else
    echo -e '\nPlease run in Ubuntu 18.04\n'
    exit
fi

printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line

# Run ganache-cli
echo -e 'Run ganache-cli'
gnome-terminal --tab --title='ganache-cli' -- /bin/bash -c "ganache-cli"
if [ $? -ne 0 ]
then
    echo "Failed!"
    exit 1
else
    echo -e 'Success to run ganache-cli\n'
    echo -e 'Copy the keys now\n'
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line
    sleep 5s
fi


# Truffle migrate
echo -e 'Truffle migrate'
cd $dev
truffle migrate

if [ $? -ne 0 ]
then
    echo "Failed!"
    exit 1
else
    echo -e 'Success truffle migrate\n'
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line
    sleep 3s
fi


# Delete previous database
echo -e 'Delete Previous Database'
sudo rm -rf /data
sudo mkdir -p /data/db
gnome-terminal --tab --title='mongod' -- /bin/bash -c "sudo mongod"
if [ $? -ne 0 ]
then
    echo "Failed!"
    exit 1
else
    echo -e 'Success to initialise database\n'
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line
    sleep 3s
fi


# Run nodemon
echo -e 'Run nodemon'
gnome-terminal --tab --title='nodemon' --working-directory=$dev_src -- /bin/bash -c "pwd; nodemon server.js"
if [ $? -ne 0 ]
then
    echo "Failed!"
    exit 1
else
    echo -e 'Success to run nodemon\n'
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line
    sleep 3s
fi


# Run ipfs
echo -e 'Run ipfs'
gnome-terminal --tab --title='ipfs' -- /bin/bash -c "ipfs daemon"
if [ $? -ne 0 ]
then
    echo "Failed!"
    exit 1
else
    echo -e 'Success to run ipfs daemon\n'
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line
    sleep 3s
fi


# Add sample items
echo -e 'Add sample items'
gnome-terminal --tab --title='Add sample items' --working-directory=$dev -- /bin/bash -c "truffle exec ./app/src/sample.js"
if [ $? -ne 0 ]
then
    echo "Failed!"
    exit 1
else
    echo -e 'Success to add sample items\n'
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line
    sleep 3s
fi


# Run npm
echo -e 'Run npm'
gnome-terminal --tab --title='npm' --working-directory=$dev_app -- /bin/bash -c "npm run dev"
if [ $? -ne 0 ]
then
    echo "Failed!"
    exit 1
else
    echo -e 'Success to run npm\n'
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '#' # Print a line
    sleep 3s
fi
