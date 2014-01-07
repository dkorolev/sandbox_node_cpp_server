// Thrift endpoints "api_*" are exposed by the frontend as "/api/*".
// The "APIEndpoints" struct lists the endpoints to be presented to the user on the status page.

namespace cpp api

struct APIEndpoints {
  1: string messages_log = "/api/messages_log",
  2: string resent_messages_log = "/api/recent_messages_log?_=RecentMessagesLogParams&seconds=10",
  3: string add = "/api/add?_=AddArguments&left_hand_side=1&right_hand_side=1"
  4: string post_message_will_return_undefined = "/api/post_message?_=MessageToPost&user=test&message=test&ms=1"
}

struct APIStatus {
  1: string status = "OK",
  2: APIEndpoints endpoints
}

struct Log {
  1: i32 total,
  2: list<string> messages
}

struct RecentMessagesLogParams {
  1: double seconds,
}

struct MessageToPost {
  1: i64 ms,
  2: string user
  3: string message
}

struct AddArguments {
  1: i32 left_hand_side,
  2: i32 right_hand_side
}

struct AddResult {
  1: i32 sum
}

service SandboxService {
   APIStatus api_status(),
   void api_post_message(1:MessageToPost message),
   Log api_messages_log()
   Log api_recent_messages_log(1:RecentMessagesLogParams params)
   AddResult api_add(1: AddArguments arguments),
}
