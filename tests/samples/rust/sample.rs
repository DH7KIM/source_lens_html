// sample.rs - a small complete Rust program (Source Viewer sample).
// Shows: comments (also /* nested /* ones */ */), attributes, structs, enums,
// traits, generics, lifetimes, closures, match, raw strings, number forms and a macro call.
//
// Build: rustc --edition 2021 -W warnings -o sample sample.rs
use std::collections::HashMap;
use std::fmt;

/// A shape with a name; doc comments start with three slashes.
#[derive(Debug, Clone, PartialEq)]
enum Shape {
    Circle { radius: f64 },
    Rect { width: f64, height: f64 },
    Unit,
}

trait Area {
    fn area(&self) -> f64;

    fn describe(&self) -> String {
        format!("area = {:.2}", self.area())
    }
}

impl Area for Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
            Shape::Rect { width, height } => width * height,
            Shape::Unit => 1.0,
        }
    }
}

struct Label<'a> {
    text: &'a str,
    count: u32,
}

impl<'a> fmt::Display for Label<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} x{}", self.text, self.count)
    }
}

fn largest<'a, T: PartialOrd>(items: &'a [T]) -> Option<&'a T> {
    let mut best = items.first()?;
    for item in items {
        if item > best {
            best = item;
        }
    }
    Some(best)
}

fn main() {
    let shapes = vec![Shape::Circle { radius: 1.5 }, Shape::Rect { width: 2.0, height: 3.5 }, Shape::Unit];
    let mut counts: HashMap<&str, u32> = HashMap::new();
    for shape in &shapes {
        let key = match shape {
            Shape::Circle { .. } => "circle",
            Shape::Rect { .. } => "rect",
            Shape::Unit => "unit",
        };
        *counts.entry(key).or_insert(0) += 1;
        println!("{:?}: {}", shape, shape.describe());
    }

    let numbers = [0xFF, 0b1010_1010, 0o17, 1_000_000];
    let doubled: Vec<i32> = numbers.iter().map(|n| n * 2).collect();
    let raw = r#"raw "text" with \n kept"#;
    let ch = 'x';
    let label = Label { text: "total", count: counts.values().sum() };

    println!("{} {} {:?} {} {:?}", label, raw, doubled, ch, largest(&numbers));
}
