//! crate doc
use std::collections::HashMap;
/* outer /* nested */ still comment */
#[derive(Debug, Clone)]
pub struct Tile<'a> { name: &'a str, size: usize }
const MAX_TILES: u32 = 1_000;
fn main() {
    let s = r#"raw "string""#;
    let c = 'x'; let b = b'\n';
    let v: Vec<i32> = vec![1, 2, 3];
    println!("{} {}", s, 1.5e3);
    for i in 0..10 { let _ = i.max(2); }
}
