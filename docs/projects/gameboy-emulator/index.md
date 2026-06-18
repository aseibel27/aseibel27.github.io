<--Image Banner-->

# Game Boy Emulator

A Game Boy emulator written in C.

## Project inspiration

The inspiration for this project came from a few sources:
- Tough, doable programming project - My brother and I would often brainstorm project ideas that would let us work together and test our abilities.  Programming a gameboy emulator would be challenging, but it had a well-defined scope and plenty of resources to go off of.
- Nostalgia - My brother and I grew up with a Nintendo 64 (Super Mario 64, Zelda: Ocarina of Time) and a Gameboy Advanced (Pokemon: Leaf Green), and we've both had a chance to go back and play games on the Original Gameboy as well. Imagine how enjoyable it would be to play old Mario, Pokemon, and Zelda games on a custom-built emulator.
- 8-bit Music - One day I came across some YouTube videos that would take music from popular Gameboy games and display the 8-bit audio waveforms that made up the sound.  How cool would it be if we could do something similar on our emulator?

## Finished demo

Video demo of emulator gameplay - [github link](https://github.com/aseibel42/gb-emu-c/tree/main)

## Features

- Fully-functioning CPU with full Game Boy instruction set (passes all blargg tests)
- Full color PPU - passes all dmg-acid2 tests (original gameboy) and cgb-acid2 tests (color gameboy) 
- Utilizes SDL2 library for window and audio support
- Functioning button i/o
- Supports multiple cartridge MBC types: ROM-only, MBC1, MBC3, MBC5
- Supports save states
- Visualization of 8-bit audio waveforms for all four audio channels
- Ability to alter emulator speed from 0x to 8x
- Offers both Windows and Linux support
- Navigatable ROM menu to select which game to play




