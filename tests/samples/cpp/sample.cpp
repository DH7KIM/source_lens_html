// sample.cpp - a small complete C++20 program (Source Viewer sample).
// Shows: comments, #include, namespaces, templates, a concept, a lambda,
// constexpr, digit separators, a raw string, enum class, attributes.
//
// Build: g++ -std=c++20 -Wall -Wextra -o sample sample.cpp
#include <algorithm>
#include <iostream>
#include <string>
#include <type_traits>
#include <vector>

namespace demo {

template <typename T>
concept Number = std::is_arithmetic_v<T>;

enum class Level { Low, Medium, High };

constexpr long long limit = 1'000'000;   // digit separators

[[nodiscard]] constexpr const char *name_of(Level level)
{
    switch (level) {
    case Level::Low:    return "low";
    case Level::Medium: return "medium";
    default:            return "high";
    }
}

template <Number T>
T sum(const std::vector<T> &values)
{
    T total{};
    for (const auto &v : values) total += v;
    return total;
}

struct Point {
    int x = 0, y = 0;
    friend std::ostream &operator<<(std::ostream &out, const Point &p)
    {
        return out << '(' << p.x << ", " << p.y << ')';
    }
};

} // namespace demo

int main()
{
    using namespace demo;

    std::vector<int> numbers{3, 1, 4, 1, 5, 9, 2, 6};
    std::sort(numbers.begin(), numbers.end(), [](int a, int b) { return a > b; });

    std::string raw = R"(raw "text" with \n kept as it is)";
    Point p{.x = 7, .y = -2};

    std::cout << "sum = " << sum(numbers) << " of " << limit << '\n'
              << "level = " << name_of(Level::Medium) << '\n'
              << "point = " << p << '\n'
              << raw << '\n';
    return 0;
}
