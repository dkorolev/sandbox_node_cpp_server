# sandbox_node_cpp_server

Two in one: a C++ server exposing Thrift API + a node.js frontend to it.

## fe.js

A node.js frontend server. Allows posting messages to a toy chat room.

Also exposes backend's Thrift endpoints to the user.

## be.cc

A C++ backend server. Receives messages.

# Prerequisites

Tested on Ubuntu 12.04.

On AWS as well. At least an m1.small instance would be recommended to build Boost.

*DO NOT USE ```sudo apt-get install libboost-dev```*
It installs Boost 1.46 despite presenting it as 1.48. And Thrift 0.9.1 is not friendly with g++ 4.7.3 -std=c++11 and Boost 1.46.

Instructions:

```
sudo apt-get update
sudo apt-get install -y build-essential autoconf g++ python-dev autotools-dev libicu-dev libbz2-dev 

wget -O boost_1_54_0.tar.gz http://sourceforge.net/projects/boost/files/boost/1.54.0/boost_1_54_0.tar.gz/download
tar xzvf boost_1_54_0.tar.gz
cd boost_1_54_0/
./bootstrap.sh
sudo ./b2 -j $(cat /proc/cpuinfo | grep "cpu cores" | uniq | awk '{print $NF}') install
cd -

wget -O thrift-0.9.1.tar.gz http://download.nextag.com/apache/thrift/0.9.1/thrift-0.9.1.tar.gz
tar xzvf thrift-0.9.1.tar.gz
cd thrift-0.9.1/
./configure
make
sudo make install
cd -

wget -O gflags-2.0-no-svn-files.tar.gz https://gflags.googlecode.com/files/gflags-2.0-no-svn-files.tar.gz
tar xzvf gflags-2.0-no-svn-files.tar.gz
cd gflags-2.0/
./configure
make
sudo make install
cd -
```

The respective tarballs for Thrift 0.9.1 and gflags 2.0 can be found in this repository as well.
