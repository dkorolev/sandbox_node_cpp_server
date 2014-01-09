# sandbox_node_cpp_server

Two in one: a C++ server exposing Thrift API + a node.js frontend to it.

## fe.js

A node.js frontend server. Allows posting messages to a toy chat room.

Also exposes backend's Thrift endpoints to the user.

## be.cc

A C++ backend server. Receives messages.

# Prerequisites

Tested on Ubuntu 12.04.

On AWS as well.

DO NOT USE ```sudo apt-get install libboost-dev``` on EC2 with Ubuntu 12.04! It installs Boost 1.46 despite presenting it as 1.48. And Thrift 0.9.1 is not friendly with g++ 4.7.3 -std=c++11 and Boost 1.46. See below for a workaround.

Instructions:

```
# Build essentials.
sudo apt-get update
sudo apt-get install -y build-essential git autoconf g++ python-dev autotools-dev libicu-dev libbz2-dev python-software-properties python nginx

# Ensure g++ 4.7 is used.
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install -y gcc-4.7 g++-4.7
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6 
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.7 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.7 
sudo update-alternatives --config gcc
g++ --version

# Install Boost.
sudo apt-get install -y libboost1.48-dev

# Install Thrift.
wget -O thrift-0.9.1.tar.gz http://download.nextag.com/apache/thrift/0.9.1/thrift-0.9.1.tar.gz
tar xzvf thrift-0.9.1.tar.gz
cd thrift-0.9.1/
./configure
make
sudo make install
cd -

# Install gflags.
wget -O gflags-2.0-no-svn-files.tar.gz https://gflags.googlecode.com/files/gflags-2.0-no-svn-files.tar.gz
tar xzvf gflags-2.0-no-svn-files.tar.gz
cd gflags-2.0/
./configure
make
sudo make install
cd -

# Install node.js.
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs

# Run.
make
./run_be.sh  # In one terminal.
./run_fe.sh  # In another terminal.
```

The respective tarballs for Thrift 0.9.1 and gflags 2.0 can be found in this repository as well.

Troubleshooting:

If Thrift C++ headers did not get installed: run the following command from the directory where Thrift was unpacked: ```(cd lib/cpp ; sudo make install)```. It's OK if it prints a bunch of errors towards the end -- 

If C++ compilation fails with the following error:

```/usr/include/c++/4.6/chrono:666:7: error: static_assert expression is not an integral constant expression```

then make sure you are using g++ version 4.7 or above. (Just commenting out that static_assert would work, but the backend would have no clue about current time.)

If Boost installation with apt-get is not working out, install it locally.

```
# Install Boost manually. Takes a while.
wget -O boost_1_54_0.tar.gz http://sourceforge.net/projects/boost/files/boost/1.54.0/boost_1_54_0.tar.gz/download
tar xzvf boost_1_54_0.tar.gz
cd boost_1_54_0/
./bootstrap.sh
sudo ./b2 -j $(cat /proc/cpuinfo | grep "cpu cores" | uniq | awk '{print $NF}') install
cd -
```
