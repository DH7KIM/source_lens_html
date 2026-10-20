// merge-parts: joins the part files of source-viewer.html into one file.
//
// Usage: merge-parts <parts folder> <output file> [--check <file>]
//
// The files named in <parts folder>/parts.txt are joined byte for byte, from top
// to bottom. Empty lines and lines starting with # in parts.txt are ignored.
// With --check, the joined data is also compared with <file> byte for byte.
//
// Build: g++ -std=c++23 -O2 -o tools/merge-parts tools/merge-parts.cpp
//        (Windows with MinGW: add -static, or the program needs the GCC DLLs on PATH)
//
// Exit code: 0 = done (and equal, with --check), 1 = different, 2 = error.
// Plain #include is used on purpose: this is a one-file tool, and "import std;"
// would need an extra build step.

#include <algorithm>
#include <cstddef>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <iterator>
#include <optional>
#include <sstream>
#include <string>
#include <string_view>
#include <vector>

namespace fs = std::filesystem;

namespace {

constexpr int kDone = 0;
constexpr int kDifferent = 1;
constexpr int kError = 2;

// Reads a whole file as bytes (binary mode, no line-ending changes).
std::optional<std::string> readFile(const fs::path& path) {
    std::ifstream in(path, std::ios::binary);
    if (!in) return std::nullopt;
    std::ostringstream buffer;
    buffer << in.rdbuf();
    if (in.bad()) return std::nullopt;
    return buffer.str();
}

// parts.txt -> list of part names. Spaces, tabs and a trailing CR are removed.
std::vector<std::string> readPartNames(const std::string& text) {
    std::vector<std::string> names;
    std::istringstream lines(text);
    std::string line;
    while (std::getline(lines, line)) {
        const auto first = line.find_first_not_of(" \t\r");
        if (first == std::string::npos) continue;
        const auto last = line.find_last_not_of(" \t\r");
        if (line[first] == '#') continue;
        names.push_back(line.substr(first, last - first + 1));
    }
    return names;
}

int fail(std::string_view message) {
    std::cerr << "error: " << message << '\n';
    return kError;
}

}  // namespace

int main(int argc, char** argv) {
    std::vector<std::string> args(argv + 1, argv + argc);
    std::optional<fs::path> checkFile;
    for (std::size_t i = 0; i < args.size();) {
        if (args[i] == "--check") {
            if (i + 1 >= args.size()) return fail("--check needs a file name");
            checkFile = args[i + 1];
            args.erase(args.begin() + static_cast<std::ptrdiff_t>(i),
                       args.begin() + static_cast<std::ptrdiff_t>(i) + 2);
        } else {
            ++i;
        }
    }
    if (args.size() != 2) {
        std::cerr << "usage: merge-parts <parts folder> <output file> [--check <file>]\n";
        return kError;
    }
    const fs::path root = args[0];
    const fs::path output = args[1];

    const auto list = readFile(root / "parts.txt");
    if (!list) return fail("cannot read " + (root / "parts.txt").string());
    const auto names = readPartNames(*list);
    if (names.empty()) return fail("parts.txt has no part names");

    // Read every part first; the output file is written only if all of them were read.
    std::string data;
    for (const auto& name : names) {
        const auto part = readFile(root / name);
        if (!part) return fail("cannot read part " + (root / name).string());
        data += *part;
    }

    {
        std::ofstream out(output, std::ios::binary | std::ios::trunc);
        if (!out) return fail("cannot write " + output.string());
        out.write(data.data(), static_cast<std::streamsize>(data.size()));
        out.flush();
        if (!out) return fail("writing failed: " + output.string());
    }
    std::cout << "joined " << names.size() << " parts -> " << output.string() << " (" << data.size()
              << " bytes)\n";

    if (checkFile) {
        const auto original = readFile(*checkFile);
        if (!original) return fail("cannot read " + checkFile->string());
        if (*original == data) {
            std::cout << "check: equal to " << checkFile->string() << " byte for byte.\n";
        } else {
            std::size_t at = 0;
            const std::size_t common = std::min(original->size(), data.size());
            while (at < common && (*original)[at] == data[at]) ++at;
            std::cout << "check failed: differs from " << checkFile->string() << " (" << original->size()
                      << " bytes there, " << data.size() << " bytes joined, first difference at byte " << at
                      << ")\n";
            return kDifferent;
        }
    }
    return kDone;
}
