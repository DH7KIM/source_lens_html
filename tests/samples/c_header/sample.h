/* sample.h - a small C/C++ header (Source Viewer sample).
 * Shows: include guard, extern "C", macros, typedef, enum, inline function.
 * It is used by sample_use.c in this folder.
 */
#ifndef SAMPLE_H
#define SAMPLE_H

#ifdef __cplusplus
extern "C" {
#endif

#define SAMPLE_VERSION_MAJOR 1
#define SAMPLE_VERSION_MINOR 0
#define SAMPLE_MAX(a, b) ((a) > (b) ? (a) : (b))

typedef struct Point {
    int x;
    int y;
} Point;

enum Color { COLOR_RED, COLOR_GREEN = 5, COLOR_BLUE };

/* Squared distance between two points (defined in sample_use.c). */
int point_distance2(Point a, Point b);

static inline int point_equal(Point a, Point b)
{
    return a.x == b.x && a.y == b.y;
}

#ifdef __cplusplus
}
#endif

#endif /* SAMPLE_H */
