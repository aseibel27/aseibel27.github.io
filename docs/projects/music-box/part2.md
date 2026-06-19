# Part 2: Serial Communication with the DFPlayer

## Setting up Arduino-DFPlayer hardware serial communication

The DFPlayer can be controlled via serial communication by using a microcontroller, such as an Arduino. I used an Arduino Mega 2560. The Arduino Mega has dedicated pins that serve as 'hardware serial' RX/TX pins. The TX pin is used for signal transmission, while the RX pin is used for signal reception. The DFPlayer also has dedicated RX/TX pins. The TX pin on the Arduino must be connected to the RX pin on the DFPlayer, and the RX pin on the Arduino to the TX pin on the DFPlayer.

The DFPlayer's RX pin is designed to operate at a 3.3V TTL level, meaning a ~2-3.3V signal will count as HIGH, and a higher 5V signal could cause damage. It is recommended to use a voltage divider to lower the voltage for this pin. I added a 680 Ohm resistor between the DFPlayer's RX pin and the Arduino's TX pin and a 1 kOhm resistor between the DFPlayer's RX pin and ground, which should drop the voltage down from 5 V to ~3V for the DFPlayer's RX pin. I powered the DFPlayer with 5V supply from the Arduino. The setup is shown below.

<FigureImage
    src="/images/music-box/BreadboardHardwareSerial_cropped.jpg"
    caption="Hardware serial connection between Arduino and DFPlayer."
/>

## Writing a basic test script

I wrote the script below to test out the serial communication functionality of the DFPlayer. 'Arduino.h' includes many of the standard Arduino functions and definitions, like setup(), loop(), pinMode(), and digitalWrite(). DFRobot, the manufacturer of the DFPlayer, provides a library called 'DFRobotDFPlayerMini.h'. I defined the RX and TX pins as pins 19 and 18, which serve as the Arduino Mega's dedicated RX1 and TX1 pins for hardware serial 'Serial1'. I initialized an instance of the DFRobotDFPlayerMini class, which I call myDFPlayer. In the setup function, I set the RX and TX pins to INPUT and OUTPUT accordingly. I also set the TX_PIN HIGH, here. The TX_PIN is typically kept HIGH between signals and without this code the first signal was not being sent correctly. I set up serial communication from the Arduino to my PC to help with debugging. I set up serial communication from the Arduino to the DFPlayer by calling Serial1.begin() with a 9600 baud rate, the rating that the DFPlayer is designed to work at. 'MyDFPlayer.begin' sends a 'reset' signal to the DFPlayer and expects to hear a response back. I then call other functions to set the volume of the DFPlayer, start the first song, read the status of the DFPlayer, and read the volume. These functions should give me a good idea of whether the serial communication is working correctly, both to and from the DFPlayer.

<div style="max-height: 15em; overflow-y: auto;">

```
#include <Arduino.h>
#include "DFRobotDFPlayerMini.h"

// Set RX and TX pins
#define RX_PIN 19
#define TX_PIN 18

// Initialize DFPlayer
DFRobotDFPlayerMini myDFPlayer;

// Initialize variables
uint8_t currentStatus = 0;
uint8_t currentVolume = 0;

void setup() {
// Initialize digital pins for input or output
pinMode(RX_PIN, INPUT);
pinMode(TX_PIN, OUTPUT);
digitalWrite(TX_PIN, HIGH);
delay(2000);

// Initialize serial communication from Arduino to PC   
Serial.begin (115200);

// Initialize hardware serial communication from Arduino to DFPlayer and reset DFPlayer
Serial1.begin(9600);    
myDFPlayer.begin(Serial1);
Serial.println("Starting serial communication");

// Set DFPlayer volume
delay(2000);
myDFPlayer.volume(10);
Serial.println("Setting volume to 10");

// Play first song
delay(2000);
myDFPlayer.playMp3Folder(1);  
Serial.println("Playing first song");

// Return status from DFPlayer
delay(2000);
currentStatus = myDFPlayer.readState();
Serial.print("Status: "); Serial.println(currentStatus);

// Return volume from DFPlayer
delay(2000);
currentVolume = myDFPlayer.readVolume();
Serial.print("Volume: "); Serial.println(currentVolume);
}

void loop() {

}
```

</div>

Running this script gave the following output on the Serial Monitor. The first song started playing at a softer volume than the default '30' setting. The status returned as '1'. The DFPlayer is supposed to return a status of '0' for not playing, '1' for playing, or '2' for paused. The DFPlayer returned the correct volume of '10' that we set it to.

<FigureImage
    src="/images/music-box/Part2a_hardwareserial_serialmonitor_cropped.png"
    outline
/>

## Investigating serial communication with an oscilloscope

I wanted to learn the details about the serial communication that was happening between the Arduino and DFPlayer, so I used an oscilloscope (Siglent SDS 1104X-E) and set up probes on the Arduino's TX (probe 1; yellow line) and RX (probe 2; purple line) lines. The first communication happens when myDFPlayer.begin() is called. I can tell exactly what information is being sent by zooming in on the TX signal. The information is bundled into 10 frames. Each frame consists of 10 bits: a start bit (always LOW), 8 data bits, and a stop bit (always HIGH). For the data bits, a HIGH value is considered a '1' and a LOW value is considered a '0'. The 8 data bits together can be represented by two HEX values (e.g., 0xFF for 1111 1111). Conveniently, my oscilloscope is able to detect the HEX values directly from the signals. This [source](https://developer.electricimp.com/resources/uart) gives a good overview of UART signalling.

<ImageCarousel
:images="[
{
    src: '/images/music-box/SDS00031_reset.png',
    caption: 'The \'Reset\' command sent from the Arduino to the DFPlayer.'
},
{
    src: '/images/music-box/SDS00032_onebyte.png',
    caption: 'One 10-bit frame from the Arduino\'s message - 0x7E corresponds to the start byte.'
},
{
    src: '/images/music-box/SDS00033.png',
    caption: 'The DFPlayer responds, acknowledging that it received the \'Reset\' command.'
}
]"
/>

The message being sent is '7E FF 06 0C 01 00 00 FE EE EF'. According to the data sheet, the first three bytes correspond to the start byte, version byte, and data length (not counting the checksum). These three bytes should always be '7E FF 06'. The fourth byte is the actual command being sent. In this case, '0x0C' corresponds to the 'reset' command, which should return the DFPlayer to default settings. The fifth byte is the 'feedback' or 'acknowledgment' byte. It is set to '0x01' when feedback is expected from the DFPlayer or '0x00' when no feedback is expected. The sixth and seventh bytes are the MSB and LSB of a parameter that can be sent with the command. For example, the intended volume should be placed in those bytes for a command that sets the volume. The eighth and ninth bytes are the MSB and LSB for the checksum and are optional. The datasheet recommends including the checksum when using a microcontroller without an internal crystal oscillator to ensure stable communication. The Arduino Mega does have a crystal oscillator, but the ATTiny85 that I'll eventually use does not. The checksum can be calculated with the following equation:

<center>Checksum (2 bytes) = 0xFFFF-(Ver.+Length+CMD+Feedback+Para_MSB+Para_LSB)+1</center>

Finally the tenth byte is the end byte, which should always be EF. The format is detailed below in a table provided by the datasheet.

<FigureImage
    src="/images/music-box/Part2a_serialcommandformattable.png"
/>

The message received is '7E FF 06 41 00 00 00 FE BA EF'. According to the datasheet, the command '0x41' is sent by the DFPlayer to notify the microcontroller that the DFPlayer successfully received a message. It is only returned when the initial message from the microcontroller includes '0x01' as its feedback byte.

Next let's look at the signals involved with some of the other commands. For 'myDFPlayer.volume', the message sent is '7E FF 06 06 01 00 0A FE EA EF'. The command byte to set volume is '0x06'. The message received is the same feedback confirmation of '7E FF 06 41 00 00 00 FE B7 EF'. Everything is as expected here.

<FigureImage
    src="/images/music-box/SDS00036_setvolume.png"
    caption="The 'Set Volume' command sent from the Arduino to the DFPlayer."
/>

Now, let's look at one of the commands that actually requests information from the DFPlayer. For myDFPlayer.GetVolume(), the message sent is '7E FF 06 43 01 00 00 FE EA EF'. The command byte for getting the volume information from the DFPlayer is '0x43'. The message received is actually two sets of 10 frames: '7E FF 06 41 00 00 00 FE B7 EF' then '7E FF 06 43 00 00 0A FE AE EF'. The first message is the same feedback confirmation. The second message includes the same command from the message that was sent to the DFPlayer (0x41), but the feedback byte is now 0x00 and the value is now '00 0A' (or 10 in decimal). This tells us that the current volume of the DFPlayer is 10, as it is supposed to be.

<FigureImage
    src="/images/music-box/SDS00038_getvolume.png"
    caption="The 'Get Volume' command sent from the Arduino to the DFPlayer."
/>

Now that hardware serial communication is working, let's try to get software serial working so that the code can be compatible with the ATTiny85!