#include "gen-cpp/SandboxService.h"

#include <chrono>
#include <mutex>
#include <thread>

#include <boost/format.hpp>

#include <thrift/protocol/TBinaryProtocol.h>
#include <thrift/server/TSimpleServer.h>
#include <thrift/transport/TServerSocket.h>
#include <thrift/transport/TBufferTransports.h>

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
  Service() : start_time_ms_(js_date_now()) {
  }
  void post_message(const MessageToPost& message) {
    std::cout << message.user << ": " << message.message << " (" << js_date_now() - message.ms << "ms)." << std::endl;
    {
      std::lock_guard<std::mutex> lock(mutex_);
      messages_.push_back(std::tie(message.user, message.message, message.ms));
    }
  }
  void api_status(APIStatus& status) {
    status.status = boost::str(boost::format("Live, uptime %.0lf seconds.") % (0.001 * (js_date_now() - start_time_ms_)));
  }
  void api_log(Log& overall_stats) {
    std::lock_guard<std::mutex> lock(mutex_);
    overall_stats.total = messages_.size();
    overall_stats.messages.resize(messages_.size());
    for (size_t i = 0; i < messages_.size(); ++i) {
      const auto& m = messages_[i];
      overall_stats.messages[i] = boost::str(boost::format("%s: %s (%.0lf seconds ago).") % std::get<0>(m) % std::get<1>(m) % (0.001 * (js_date_now() - std::get<2>(m))));
    }
  }

 private:
  std::mutex mutex_;
  uint64_t start_time_ms_;
  std::vector<std::tuple<std::string, std::string, uint64_t> > messages_;
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
