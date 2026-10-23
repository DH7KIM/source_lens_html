/* sample_use.c - uses sample.h. Build: gcc -std=c11 -Wall -Wextra -o sample_use sample_use.c */
#include <stdio.h>

#include "sample.h"

int point_distance2(Point a, Point b)
{
    int dx = a.x - b.x;
    int dy = a.y - b.y;
    return dx * dx + dy * dy;
}

int main(void)
{
    Point origin = { 0, 0 };
    Point target = { 3, 4 };
    enum Color color = COLOR_BLUE;

    printf("v%d.%d distance^2 = %d, equal = %d, color = %d, max = %d\n",
           SAMPLE_VERSION_MAJOR, SAMPLE_VERSION_MINOR,
           point_distance2(origin, target), point_equal(origin, target),
           (int)color, SAMPLE_MAX(3, 9));
    return 0;
}
