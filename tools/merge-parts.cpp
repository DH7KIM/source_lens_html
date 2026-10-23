// merge-parts: joins the part files of source-viewer.html into one file.
//
// Usage: merge-parts <parts folder> <output file> [--check <file>]
//
// The files named in <parts folder>/parts.txt are joined byte for byte, from top
// to bottom. Empty lines and lines starting with # in parts.txt are ignored.
// <parts folder>/version.txt (two lines: the version "0.75.0", then the date "2026-10-23")
// is read too. After joining, every {{VERSION}} in the data becomes the version and every
// {{DATE}} the date, so the version is written in one place only.
// With --check, the joined data (after that replacement) is compared with <file> byte for byte.
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
#include <utility>
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

// Version information read from version.txt.
struct VersionInfo {
    std::string number;  // "0.75.0"
    std::string date;    // "2026-10-23"
};

// Splits text into lines; spaces, tabs and a trailing CR are removed, empty lines are skipped.
std::vector<std::string> readLines(const std::string& text) {
    std::vector<std::string> result;
    std::istringstream lines(text);
    std::string line;
    while (std::getline(lines, line)) {
        const auto first = line.find_first_not_of(" \t\r");
        if (first == std::string::npos) continue;
        const auto last = line.find_last_not_of(" \t\r");
        result.push_back(line.substr(first, last - first + 1));
    }
    return result;
}

bool allDigits(std::string_view text) {
    return !text.empty() && std::ranges::all_of(text, [](char c) { return c >= '0' && c <= '9'; });
}

// "0.75.0": three numbers separated by dots.
bool isVersionNumber(std::string_view text) {
    int parts = 0;
    std::size_t start = 0;
    while (true) {
        const auto dot = text.find('.', start);
        const auto piece = text.substr(start, dot == std::string_view::npos ? dot : dot - start);
        if (!allDigits(piece)) return false;
        ++parts;
        if (dot == std::string_view::npos) break;
        start = dot + 1;
    }
    return parts == 3;
}

// "2026-10-23": year-month-day with a plausible month and day.
bool isDate(std::string_view text) {
    if (text.size() != 10 || text[4] != '-' || text[7] != '-') return false;
    const auto year = text.substr(0, 4);
    const auto month = text.substr(5, 2);
    const auto day = text.substr(8, 2);
    if (!allDigits(year) || !allDigits(month) || !allDigits(day)) return false;
    const int m = std::stoi(std::string(month));
    const int d = std::stoi(std::string(day));
    return m >= 1 && m <= 12 && d >= 1 && d <= 31;
}

// version.txt -> VersionInfo, or an error message.
std::pair<std::optional<VersionInfo>, std::string> parseVersionFile(const std::string& text) {
    const auto lines = readLines(text);
    if (lines.size() != 2) return {std::nullopt, "version.txt must have 2 lines: the version, then the date"};
    if (!isVersionNumber(lines[0])) {
        return {std::nullopt, "version.txt line 1 must look like 0.75.0, not \"" + lines[0] + "\""};
    }
    if (!isDate(lines[1])) {
        return {std::nullopt, "version.txt line 2 must look like 2026-10-23, not \"" + lines[1] + "\""};
    }
    return {VersionInfo{lines[0], lines[1]}, {}};
}

// Replaces every `from` in `text` with `to`; returns how many were replaced.
std::size_t replaceAll(std::string& text, std::string_view from, std::string_view to) {
    std::size_t count = 0;
    for (std::size_t at = text.find(from); at != std::string::npos; at = text.find(from, at + to.size())) {
        text.replace(at, from.size(), to);
        ++count;
    }
    return count;
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

    const auto versionText = readFile(root / "version.txt");
    if (!versionText) return fail("cannot read " + (root / "version.txt").string());
    const auto [version, versionError] = parseVersionFile(*versionText);
    if (!version) return fail(versionError);

    // Read every part first; the output file is written only if all of them were read.
    std::string data;
    for (const auto& name : names) {
        const auto part = readFile(root / name);
        if (!part) return fail("cannot read part " + (root / name).string());
        data += *part;
    }
    const auto versionCount = replaceAll(data, "{{VERSION}}", version->number);
    const auto dateCount = replaceAll(data, "{{DATE}}", version->date);
    if (versionCount == 0) std::cerr << "warning: no {{VERSION}} in the parts\n";

    {
        std::ofstream out(output, std::ios::binary | std::ios::trunc);
        if (!out) return fail("cannot write " + output.string());
        out.write(data.data(), static_cast<std::streamsize>(data.size()));
        out.flush();
        if (!out) return fail("writing failed: " + output.string());
    }
    std::cout << "joined " << names.size() << " parts -> " << output.string() << " (" << data.size()
              << " bytes), version " << version->number << " (" << version->date << "), replaced "
              << versionCount << " {{VERSION}} and " << dateCount << " {{DATE}}\n";

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
