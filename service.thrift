namespace cpp api

struct MessageToPost {
  1: i64 ms,
  2: string user
  3: string message
}

service SandboxService {
   void post_message(1:MessageToPost message)
}
