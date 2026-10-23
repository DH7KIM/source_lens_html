# CMake sample: project, variables, targets, conditions
cmake_minimum_required(VERSION 3.20)
project(hello VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(SOURCES src/main.cpp src/util.cpp)

add_executable(hello ${SOURCES})
target_include_directories(hello PRIVATE include)
target_compile_options(hello PRIVATE -Wall -Wextra)

if(WIN32)
    target_link_libraries(hello PRIVATE user32 gdi32)
elseif(UNIX)
    target_link_libraries(hello PRIVATE m)
endif()

message(STATUS "Building ${PROJECT_NAME} ${PROJECT_VERSION}")
install(TARGETS hello DESTINATION bin)
