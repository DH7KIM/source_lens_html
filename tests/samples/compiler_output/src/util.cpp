#include "util.h"

int scale(int x) {
    int factor = 3;
    if (x > 10)
        return x * factor;
}

int clamp(int v, int lo, int hi) {
    return v < lo ? lo : v;
}
