#include "gen-cpp/SandboxService.h"

#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/server/TSimpleServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/TBufferTransports.h>

#include <chrono>

uint64_t js_date_now() {
  return std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
}

using namespace ::apache::thrift;
using namespace ::apache::thrift::protocol;
using namespace ::apache::thrift::transport;
using namespace ::apache::thrift::server;

using namespace ::api;

class Service : virtual public SandboxServiceIf {
 public:
  void post_message(const MessageToPost& message) {
    std::cout << message.user << ": " << message.message << " (" << js_date_now() - message.ms << "ms)." << std::endl;
  }
};

int main() {
  const int port = 9090;
  boost::shared_ptr<Service> handler(new Service());
  boost::shared_ptr<TProcessor> processor(new SandboxServiceProcessor(handler));
  boost::shared_ptr<TServerTransport> serverTransport(new TServerSocket(port));
  boost::shared_ptr<TTransportFactory> transportFactory(new TBufferedTransportFactory());
  boost::shared_ptr<TProtocolFactory> protocolFactory(new TBinaryProtocolFactory());
  TSimpleServer(processor, serverTransport, transportFactory, protocolFactory).serve();
}
