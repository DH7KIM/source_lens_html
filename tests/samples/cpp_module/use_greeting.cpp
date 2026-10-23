// use_greeting.cpp - uses the module "greeting" (see greeting.cppm).
#include <cstdio>

import greeting;

int main()
{
    greeting::Counter counter;
    counter.next();
    counter.next();

    greeting::print_line(greeting::message());
    std::printf("version %d, twice(21) = %d, count = %d\n",
                greeting::version, greeting::twice(21), counter.count);
    return 0;
}
