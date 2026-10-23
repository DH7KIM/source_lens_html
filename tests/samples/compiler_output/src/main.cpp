#include <iostream>
#include <vector>
#include "util.h"

int main() {
    std::vector<int> v{1, 2, 3};
    int unused = 0;
    for (int i = 0; i < v.size(); ++i) {
        std::cout << scale(v[i]) << "\n";
    }
    std::cout << scale(1, 2) << "\n";
    std::cout << total << "\n";
    return 0
}
