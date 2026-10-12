// UI module
module;
#include <windows.h>
#include "local.h"
export module ui;
import std;
/* block
   comment */
export namespace ui {
  constexpr int MAX_W = 1'000;
  auto s = R"(raw ")" string)";
  class Button { public: void draw(HDC dc) const; };
  std::uint32_t f(float x) { return static_cast<int>(x * 0.5f) + 0x1F; }
}
