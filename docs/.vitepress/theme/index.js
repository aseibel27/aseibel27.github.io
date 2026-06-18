import DefaultTheme from 'vitepress/theme'

import ImageCarousel from './components/ImageCarousel.vue'
import FigureImage from './components/FigureImage.vue'

export default {

    extends: DefaultTheme,

    enhanceApp({ app }) {

        app.component(
            'ImageCarousel',
            ImageCarousel
        )

        app.component(
            'FigureImage',
            FigureImage
        )

    }

}