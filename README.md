# sandbox_node_cpp_server

Two in one: a C++ server exposing Thrift API + a node.js frontend to it.

## fe.js

A node.js frontend server. Allows posting messages to a toy chat room.

Also exposes backend's Thrift endpoints to the user.

## be.cc

A C++ backend server. Receives messages.

# Prerequisites

Tested on Ubuntu 12.04 with Thrift 0.9.1 installed.
