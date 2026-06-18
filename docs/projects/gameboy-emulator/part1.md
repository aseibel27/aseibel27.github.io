# Part 1 - Resources and Hardware Overview

## Resources for emulator development

There were several valuable resources that helped us out during this process including: 
- [Gameboy pandocs](https://gbdev.io/pandocs/) 
- [instruction set matrix](https://www.pastraiser.com/cpu/gameboy/gameboy_opcodes.html) 
- [Gameboy blargg test ROMs](https://github.com/aquach/gameboy/tree/master/test-roms/blargg/cpu_instrs/source) (CPU instruction set tests) 
- [dmg-acid2](https://github.com/mattcurrie/dmg-acid2) and [cgb-acid2](https://github.com/mattcurrie/cgb-acid2) (PPU tests) 
- [LLD gameboy emulator series](https://www.youtube.com/watch?v=e87qKixKFME&list=PLVxiWMqQvhg_yk4qy2cSC3457wZJga_e5)
- [The Ultimate Gameboy Talk](https://www.youtube.com/watch?v=HyzD8pNlpwI)
- [Ghostsonic](https://github.com/GhostSonic21/GhostBoy), [Boytacean](https://github.com/joamag/boytacean), and other publicly available emulator source code 

## Gameboy hardware overview

The gameboy itself is primarily composed of a system clock, central processing unit (CPU), pixel processing unit (PPU), audio processing unit (APU), I/O buttons, and some memory.  Game data is stored in cartridges as read-only memory (ROM) and sometimes in additional battery-powered random-access memory (RAM).  An emulator would need to accurately simulate the behavior of all of these different components and how they interact with each other.

<ImageCarousel
:images="[
{
    src: '/projects/gameboy-emulator/images/gameboy_color.png',
    caption: 'Gameboy Color.',
},
{
    src: '/projects/gameboy-emulator/images/gameboy_hardware.png',
    caption: 'Hardware architecture of the Gameboy.'
},
{
    src: '/projects/gameboy-emulator/images/gameboy_cgb_board.png',
    caption: 'Motherboard from the Gameboy Color.'
}
]"
/>

Below is a short summary of the Gameboy's main hardware components.
- Clock: An oscillating signal set at 4 MHz.  The CPU, PPU, and APU all listen to this clock to set their speeds. 

- CPU: The CPU executes through the game code following a set of hardwired instructions.  The gameboy has a hybrid instruction set of the Intel 8080 and Zilog Z80 microprocessors.  Microcode executes at 4 MHz, but gets grouped into 4-tick cycles called Machine (M)-Cycles, with over 500 different opcodes.  Each instruction takes 1-6 M-cycles to execute.  Several of the opcodes are shown in the table to the right.  The cpu has several built-in 8-bit registers (A, B, C, D, E, F, H, L) to process bytes and these registers can also be used in pairs (AF, BC, DE, HL).  There is a Stack pointer register (SP) that can keep track of the location of data pushed to High RAM.  The CPU will also handle interrupts (which are flags that tell the CPU to execute other code before jumping back to what it was doing).  Interrupts can be from timers, button I/O, or from dialog with the PPU. 

<FigureImage
    src="/projects/gameboy-emulator/images/gameboy_instruction_matrix.png"
    caption="Part of the Gameboy's instruction matrix."
/>

- PPU: The PPU works in parallel with the cpu, using data in VRAM and some other logic to draw pixels (1 of 4 colors) to the LCD screen - pixel by pixel, row by row.  The ppu ticks at 4 MHz and is designed to redraw the LCD screen at a rate of 59.7 frames per second, or once every 17556 M-cycles.  The LCD screen is 160 x 144 pixels, with pixels arranged in 8x8 tiles.  Tiles can be part of the background, window, or sprites.  The background is self-explanatory.  Sprites can be 8x8 or 8x16 pixels and can be moved around independently of the background.  The window will display in front of everything else on the screen.  

- APU: The APU generates audio samples at a rate of 1 MHz.  One audio sample is essentially a single amplitude measurement at a given point in time, and a stream of audio samples will make up a waveform.  The APU takes information from certain registers in the Gameboy's High RAM to produce 4 separate audio channels (or streams) before mixing them into a single stream for output.  Each channel has dedicated writable registers in High RAM that help control the volume, frequency, and length of notes.
  - Ch1 & Ch2: Square wave channels - They both have modifiable volume, volume envelope (crescendo or decrescendo), length, frequency, and wave duty.  Ch1 has the added functionality of a frequency sweep (frequency can increase or decrease at some specified rate).
  - Ch3: Special wave pattern channel 
  - Ch4: Noise channel

<FigureImage
    src="/projects/gameboy-emulator/images/gameboy_audio.png"
    caption="Four wave channels make up the Gameboy's audio."
/>

- I/O buttons: These buttons are how the Gameboy gets user input (A, B, Start, Select, or UDLR on the D-pad). A button press triggers an interrupt for the CPU.  

- Memory: The Gameboy and cartridge have 64 kb of addressable 8-bit memory (up to 0xFFFF in hex).  The first 32 kB come from the cartridge ROM.  If the ROM is larger than 32 kB (ROMs can be >1Mb), a memory bank controller (MBC) in the cartridge can allow the gameboy to access different regions in the cartridge memory.   The rest of addressable memory is mostly the Gameboy's VRAM (which holds tile information), registers for the PPU, APU, or I/O, and the stack.  During startup the Gameboy first reads 256 bytes of an internal boot ROM (which shows the Nintendo logo among other things) and then jumps to address 0x0100 in the cartridge ROM to start running the game's code.  When saving a game, certain data gets copied to the cartridge's RAM. 

<FigureImage
    src="/projects/gameboy-emulator/images/gameboy_memory_map.png"
    caption="Address map of the Gameboy's memory."
/>