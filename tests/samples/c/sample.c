/* sample.c - a small complete C program (Source Viewer sample).
 * Shows: block and line comments, preprocessor lines, strings, characters,
 * number forms, a struct, a function pointer and a loop.
 *
 * Build: gcc -std=c11 -Wall -Wextra -o sample sample.c
 */
#include <stdio.h>
#include <stdlib.h>

#define ITEM_COUNT 4
#define SQUARE(x) ((x) * (x))

typedef struct {
    const char *name;
    int         score;
    double      ratio;
} Item;

/* Order items from the highest score to the lowest (used by qsort). */
static int compare_score(const void *a, const void *b)
{
    const Item *x = a, *y = b;
    return (y->score > x->score) - (y->score < x->score);
}

int main(void)
{
    Item items[ITEM_COUNT] = {
        { "alpha", 42,       0.5   },
        { "beta",  0x2A + 8, 1.25e1 },   /* hex number and exponent */
        { "gamma", 017,      .75   },    // octal number
        { "delta", SQUARE(3), 3.14 },
    };
    char grade = 'A';
    const char *tab_text = "tab\there, quote \" and backslash \\";

    qsort(items, ITEM_COUNT, sizeof items[0], compare_score);

    for (int i = 0; i < ITEM_COUNT; ++i) {
        printf("%-6s %3d %6.2f\n", items[i].name, items[i].score, items[i].ratio);
    }
    printf("%c: %s\n", grade, tab_text);
    return EXIT_SUCCESS;
}
