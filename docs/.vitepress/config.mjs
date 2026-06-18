export default {

    title: "Alex Seibel",
    description: "Engineering Portfolio",

    themeConfig: {

        nav: [
            {
                text: "Home",
                link: "/"
            },

            {
                text: "Projects",
                link: "/#projects"
            }
        ],

        sidebar: [
            {
                text: "Game Boy Emulator",
                items: [
                    {
                        text: "Overview",
                        link: "/projects/gameboy-emulator/"
                    },

                    {
                        text: "Part 1 - Resources and Hardware Overview",
                        link: "/projects/gameboy-emulator/part1"
                    },
                ]
            },

            {
                text: "8-bit Breadboard Computer",
                items: [
                    {
                        text: "Overview",
                        link: "/projects/8bit-computer/"
                    },
                ]
            },

            {
                text: "CNC Drawing Machine",
                items: [
                    {
                        text: "Overview",
                        link: "/projects/drawing-machine/"
                    },
                ]
            },

            {
                text: "ATtiny85 Music Box",
                items: [
                    {
                        text: "Overview",
                        link: "/projects/music-box/"
                    },

                    {
                        text: "Part 1 - Testing Out the DFPlayer",
                        link: "/projects/music-box/part1"
                    },

                    {
                        text: "Part 2 - Serial Communication with the DFPlayer",
                        link: "/projects/music-box/part2"
                    },
                ]
            },

            {
                text: "Plant Monitor",
                items: [
                    {
                        text: "Overview",
                        link: "/projects/plant-monitor/"
                    },
                ]
            },
        ]
    }
}