# Makefile sample: variables, rules, phony targets, pattern rule
CXX      := g++
CXXFLAGS := -std=c++23 -O2 -Wall -Wextra
TARGET   := hello
OBJS     := main.o util.o

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

# pattern rule: build every .o from its .cpp
%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

run: $(TARGET)
	./$(TARGET)

clean:
	rm -f $(TARGET) $(OBJS)
