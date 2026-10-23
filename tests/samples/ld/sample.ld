/* Linker script sample: entry point and memory layout */
ENTRY(_start)

SECTIONS
{
    . = 0x10000;

    .text : { *(.text .text.*) }
    .rodata : { *(.rodata .rodata.*) }

    . = ALIGN(0x1000);
    .data : { *(.data .data.*) }
    .bss : { *(.bss .bss.* COMMON) }

    /DISCARD/ : { *(.comment) }
}
