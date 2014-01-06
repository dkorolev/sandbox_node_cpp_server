// Thrift endpoints "api_*" are exposed by the frontend as "/api/*".
// The "APIEndpoints" struct lists the endpoints to be presented to the user on the status page.

namespace cpp api

struct APIEndpoints {
  1: string log = "/api/log"
}

struct APIStatus {
  1: string status = "OK",
  2: APIEndpoints endpoints
}

struct Log {
  1: i32 total,
  2: list<string> messages
}

struct MessageToPost {
  1: i64 ms,
  2: string user
  3: string message
}

service SandboxService {
   void post_message(1:MessageToPost message),
   APIStatus api_status(),
   Log api_log()
}
