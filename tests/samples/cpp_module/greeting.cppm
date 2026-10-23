// greeting.cppm - a C++20 module interface unit (Source Viewer sample).
// Shows: the global module fragment, "export module", "export" and "import".
// It is used by use_greeting.cpp in this folder.
//
// Build (GCC):
//   g++ -std=c++20 -fmodules-ts -x c++ -c greeting.cppm
//   g++ -std=c++20 -fmodules-ts -o use_greeting use_greeting.cpp greeting.o
module;

#include <cstdio>

export module greeting;

export namespace greeting {

inline constexpr int version = 1;

constexpr int twice(int value) { return value * 2; }

struct Counter {
    int count = 0;
    void next() { ++count; }
};

const char *message() { return "Hello from a module!"; }

void print_line(const char *text) { std::puts(text); }

} // namespace greeting
